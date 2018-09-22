function cargarDatosUsuario(usuario)
{	
	console.log(usuario);
	jQuery.ajax({
		url:        'ws/sap/data/showmember',
        type:       'GET',
        dataType:   'json',
        async: 		false,
        data: 		{user:usuario}
	})
	.done(function (response) {
		if (response.result) {
			// jQuery('#tarjeta_user').val(response.records.MONIBYTE);
			console.log(response.records);
			localStorage.setItem('TRAVEL_DATOS_USUARIO', JSON.stringify(response.records));
			cargarDatosJefe(usuario);
		} else {
			console.log(response.message);
		}	
	})
}

function cargarDatosJefe(usuario)
{
	jQuery.ajax({
		url:        'ws/concursos/perfil',
        type:       'GET',
        dataType:   'json',
        data: 		{ user:usuario }
	})
	.done(function (response) {
		if (response.result) {
			localStorage.setItem('TRAVEL_DATOS_JEFE', JSON.stringify(response.records.jefe));
		} else {
			console.log(response.message);
		}	
	})
}