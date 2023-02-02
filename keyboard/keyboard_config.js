module.exports = function() {
	return [
		[
			{
				text: `Отримати конфіги для першої сфп\n(Заповнення темплейтів, очищення ону із сфп)`,
				callback_data: 'get_config_first_sfp'
			}
		],
		[
			{
				text: `Видалення вланів для пппое абонентів, видалення темплейтів`,
				callback_data: 'delete_vlans'
			}
		],
		[
			{
				text: `3`,
				callback_data: 'aw_confirm'
			}
		],
        [
            {
                text: `❇️  Головне меню`, callback_data: "return_home"
            }
        ],
		
	];
};
