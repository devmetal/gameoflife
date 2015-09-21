var Cell = React.createClass({
	render: function() {
		var isLive = !!this.props.isLive;
		var className = (isLive)?'live':'dead';
		return (
			<div className={className}></div>
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
		//ajax requests	
	},
	
	render: function() {
		var n = this.props.n;
		var w = this.props.width;
		
		var cellWidth = w / n;
		var cellHeight = cellWidth;
		
		var cells = this.state.matrix.reduce(function(row){
			
		});
		
		return (
			<div style={{width:w + 'px'}}>
				
			</div>
		);
	}
});