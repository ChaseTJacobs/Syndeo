// module template object

exports.module_template = {
	'name':"",
	'number':0,
	'description':"",
	'steps':[
		{
			'number':1,
			'title':"",
			'description':"",
			'sub_steps':[
				{
					'title':"", // each view can have more than one "item"
					'item':[
						{
							'type':"text, image, link, embedded video, ???",
							'data':null
						}
					]
				}
			]
		}
	]
};