jQuery( document ).ready( function( $ )
{	
	//Variables
	var idregistro = 0;
	var ideliminar = 0;
	var subio 	   = false;

	//Propiedades
	$('.input-date-picker').datepicker({
		format: 'yyyy-mm-dd',
        orientation: "bottom",
        daysOfWeekDisabled: "7",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true
    });

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
	
	$('#btn-consultar').on('click', function( e )
	{
		e.preventDefault();
		var fechainicio 	= $('#fecha_inicio').val();
		var fechafin 		= $('#fecha_fin').val();

		if( fechafin > fechainicio || fechainicio == fechafin)
		{
			$.ajax({
				type: 	'GET',
				url: 	'ws/reportes/comentarioscomedor',
				data: 	{ finicio:fechainicio, ffin:fechafin },
				success: function( result )
					{
						if( result.result )
						{
							$("#tabla-registros").dataTable().fnClearTable();
							var cont = 0;
		                    $.each(result.records, function( index , value )
		                    {
		                    	cont++;
		                     	$('#tabla-registros').dataTable().fnAddData([
		                     		cont,
		                     		value.comedor,
		                     		value.usuario,
		                     		value.comentario,
		                     		value.fecha_comentario
		                     	]);
		                    });
							toastr['success'](result.message, 'Éxito');
						}
						else
						{
							$("#tabla-detalle").dataTable().fnClearTable();
							toastr['error'](result.message, 'Error');
						}
					},
				error: function( result )
					{
						toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
					}
			});
		}
		else
			toastr['error']('Fechas invalidas, por favor revise', 'Error');
	});

	$("#btn-exportar").on( "click", function( e )
	{
		e.preventDefault();
		var fechainicio = $('#fecha_inicio').val();
		var fechafin = $('#fecha_fin').val();

		if( fechainicio != '' && fechafin !='' )
		{	
			if( fechafin > fechainicio || fechafin == fechainicio)
			{
				window.location.href = "ws/exportar/comentarioscomedor?finicio="+fechainicio+"&ffin="+fechafin;
				toastr["success"]("Exportado correctamente", "Éxito");
			}
			else
				toastr["error"]("Fechas invalidas, por favor revise", "Error");
		}
		else
			toastr["error"]("Seleccione fechas por favor","Error");
		
	});
});