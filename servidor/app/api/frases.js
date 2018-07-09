var api = {};

var frases = [
	{_id: 0, texto:'Aliquam nec ornare nisl.', tempo:5 },
	{_id: 1, texto:'Duis pellentesque dignissim.', tempo: 5 },
	{_id: 2, texto:' Fusce eget sem non arcu tempus tempor a et justo.', tempo: 10 },
	{_id: 3, texto:'Fusce et nulla vitae lacus sagittis rhoncus.', tempo: 10 },
	{_id: 4, texto:'Etiam finibus lorem vitae ultrices dignissim. Nam laoreet hendrerit iaculis.', tempo: 15 },
	{_id: 5, texto:'Quisque luctus non purus at molestie. Nullam sit amet tempus elit. Fusce tempus et magna sed accumsan.', tempo: 20 },
	{_id: 6, texto:'Etiam interdum erat vitae libero feugiat, nec venenatis turpis varius. Ut dapibus, tellus in porta dapibus.', tempo: 20 },
	{_id: 7, texto:'Vestibulum eget sagittis mauris, vel egestas magna. Curabitur ac gravida risus. Mauris quis consequat turpis. Morbi turpis diam, tincidunt ultrices tristique vel, malesuada scelerisque ex.', tempo: 25 },
	{_id: 8, texto:'Nullam at metus ac elit auctor mollis. Nullam congue felis eu nisl pretium tempus. Donec eget aliquet massa. Integer quis tempus tellus.', tempo: 25 },
	{_id: 9, texto:'Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis eu finibus nunc, in tempus magna. Donec dapibus ut lorem vel accumsan. Duis id magna eu erat placerat scelerisque ac ac nunc. Suspendisse potenti.',tempo: 30 },

	];

api.lista = function(req, res) {

	setTimeout(function(){
		if(req.query.id) return res.json(frases[req.query.id]);

		res.json(frases);
	},1500);

};

module.exports = api;
