package main

import "log"
import "os"
import "net/http"
import "path"
import "io/ioutil"
import "github.com/devmetal/gol"
import "fmt"

func loadPage(file string) ([]byte, error) {
  body, err := ioutil.ReadFile(file)
  if (err != nil) {
    return nil, err
  }

  return body, nil
}

type GameOfLifeServer struct {
  life *gol.LifeMatrix
  buffer <-chan byte[]
  signal <-chan int
}

type StaticFilesServer struct {
  filesPath string
}

func (srv *GameOfLifeServer) Buffering(signal <- chan int, int n) {
  for {
    <- signal
    for i := 0; i < n; i++ {
      srv.life.Iter()
      srv.buffer <- srv.life.JsonString()
    }
  }
}
 
func (srv *GameOfLifeServer) ServeHTTP(w http.ResponseWriter, req *http.Request) {
  srv.life.Iter()
  json, _ := srv.life.JsonString()
  w.Write(json)
}

func (sfs *StaticFilesServer) ServeHTTP(w http.ResponseWriter, req *http.Request) {
  urlPath := req.URL.Path
  if(len(urlPath) == 0 || urlPath == "/") {
    urlPath = "index.html"
  } else {
    urlPath = urlPath[1:]
  }

  filePath := path.Join(sfs.filesPath, urlPath)
  fmt.Println(filePath)
  content, _ := loadPage(filePath)
  w.Write(content)
}

func NewGameOfLifeServer() *GameOfLifeServer {
  file, err := os.Open(os.Args[1])
  if err != nil {
    log.Fatal(err)
  }
  defer file.Close()

  lm := gol.NewLifeMatrix(file, 100)
  buf := make(chan byte[], 30)
  sig := make(chan int)
  return &GameOfLifeServer{lm, buf}
}

func NewStaticFileServer() *StaticFilesServer {
  vp := path.Join(os.Getenv("GOPATH"), "/src/github.com/devmetal/gameoflife/public")
  return &StaticFilesServer{vp}
}

func main() {
  srv := NewGameOfLifeServer()
  files := NewStaticFileServer()
  http.Handle("/life", srv)
  http.Handle("/", files)
  http.ListenAndServe(":8080", nil)
}
