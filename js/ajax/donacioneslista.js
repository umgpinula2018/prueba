jQuery( document ).ready( function( $ )
{
	// Loader con tiempo
	$("#loader").show();
	setTimeout(function(){ $("#loader").fadeOut(); }, 1000);

	//Variables
	var idregistro = 0;
	var ideliminar = 0;
	var subio 	   = false;

	// Propiedades
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

	$("#tabla-registros").on('click','a.btn-list', function( e )
	{
		$("#loader").show();
		e.preventDefault();
		idregistro = $(e.target).closest("a").data("idregistro");
	    $.ajax(
		{
			type: 		'GET',
			url: 		'ws/donaciones/detallesolicitud',
			data: 		{ idsolicitud:idregistro },
			success: function( result )
				{
					if( result.result )
					{
						$("#loader").fadeOut();
						$("#tabla-productos").dataTable().fnClearTable();
						$("#tabla-activos").dataTable().fnClearTable();
						var cont = 0;
						var cont2 = 0;
			            $.each(result.records.productos, function(index, value)
			            {
			            	cont++;
			            	$("#tabla-productos").dataTable().fnAddData([ 
			            		cont,
			            		value.codigo,
			            		value.descripcion,
			            		value.unidad,
			            		value.costo
							]);
			            });
			            $.each(result.records.activos, function(index, value)
			            {
			            	cont2++;
			            	$("#tabla-activos").dataTable().fnAddData([ 
			            		cont2,
			            		value.codigo,
			            		value.descripcion
							]);
			            });
			            
					}
					else
					{
						$("#loader").fadeOut();
						$("#tabla-productos").dataTable().fnClearTable();
						$("#tabla-activos").dataTable().fnClearTable();
						toastr['error'](result.message, 'Error');
					}
				},
			error: 	function( result )
				{
					toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
				}
		});
	});
});