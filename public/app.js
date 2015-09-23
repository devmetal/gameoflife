var Cell = React.createClass({
	render: function() {
		var isLive = !!this.props.isLive;
		var className = 'cell ' + ((isLive)?'live':'dead');
		
		var cssStyle = {
			width: this.props.width + '%',
			height: this.props.height + '%'
		};
		
		return (
			<div className={className} style={cssStyle}></div>
		);
	}
});

var GameOfLife = React.createClass({
	getInitialState: function() {
		return {
			matrix:[]
		}
	},
	
	componentDidMount: function() {
		var tm = null;
		console.log("mount");
		
		function getRequest() {
			clearTimeout(tm);
			xhrGetJson('/life')
			.then((result) => {
				this.setState({
					matrix: result
				});
				
				tm = setTimeout(() => {
					getRequest.apply(this);
				}, 100);
				
			},(error) => {
				window.alert(error);
			});
		}
		
		getRequest.apply(this);
	},
	
	render: function() {
		var n = this.props.n;
		var w = 100;
		
		var cellWidth = (w / n);
		var cellHeight = cellWidth;
		var cells = [];
		var ci = 0;
		
		for (var i = 0; i<this.state.matrix.length; i++) {
			for (var j = 0; j<this.state.matrix[i].length; j++) {
				cells.push(<Cell isLive={this.state.matrix[i][j]} width={cellWidth} height={cellHeight} key={ci} />);
				ci++;
			}
		}
		
		return (
			<div id="GameOfLife">
				{cells}
			</div>
		);
	}
});