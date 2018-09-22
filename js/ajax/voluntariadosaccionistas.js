jQuery( document ).ready( function( $ )
{
	var idregistro = 0;

	window.tabla= $('.datatable').dataTable(
	{
		"oLanguage": {
			"sLengthMenu": "Mostrando _MENU_ filas",
			"sSearch": "",
			"sProcessing":     "Procesando...",
			"sLengthMenu":     "Mostrar _MENU_ registros",
			"sZeroRecords":    "No se encontraron resultados",
			"sEmptyTable":     "Ningún dato disponible en esta tabla",
			"sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
			"sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
			"sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
			"sInfoPostFix":    "",
			"sSearch":         "Buscar:",
			"sUrl":            "",
			"sInfoThousands":  ",",
			"sLoadingRecords": "Cargando...",
			"oPaginate": {
				"sFirst":    "Primero",
				"sLast":     "Último",
				"sNext":     "Siguiente",
				"sPrevious": "Anterior"
			}
		}
	});

	$('#loader').hide();
	
	$('#tabla-registros').on('click', 'a.btn-responder', function( e ){
		idregistro = $(e.target).closest('a').data('idregistro');
	});

	$('button.accion').on('click', function( )
	{
		aprobado = $(this).data('accion') == 'A' ? 1 : 0;

		$.ajax(
		{
			type: 	'POST',
			url: 	'ws/voluntariadosac/respondersolicitud',
			data: 	{ aprobado:aprobado, idregistro:idregistro },
			success: function( data )
			{
				if( data.result )
				{
					$('#modal-responder').modal('hide');
					toastr['success'](data.message, 'Éxito');
					setTimeout( function(){ amigable(); }, 500);  
				}
				else
				{
					toastr['error'](data.message, 'Error');
				}
			},
			error: function( err )
			{
				console.log( err );
			}
		});
	});
});