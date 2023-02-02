module.exports = function() {
	return [
		[
			{
				text: `Перенесення кофігів`,
				callback_data: 'get_config'
			}
		],
		[
			{
				text: `реєстрація ону на zte`,
				callback_data: 'reg_onu'
			}
		],
		[
			{
				text: `пункт 2`,
				callback_data: 'aw_confirm'
			}
		],
		
	];
};
