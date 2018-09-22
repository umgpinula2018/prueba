jQuery( document ).ready( function( $ )
{	
	$('#loader').fadeOut();
	llenarTabla();
	// Propiedades
	window.tabla = $('.datatable').dataTable(
	{
		'iDisplayLength': 5,
		"lengthMenu": [[5, 10], [5, 10]],
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

	window.tabla = $('.datatable2').dataTable(
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

	$('.input-date-picker').datepicker({
		format: 'yyyy-mm-dd',
        orientation: "bottom",
        daysOfWeekDisabled: "7",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true
    });

    function llenarTabla()
    {
    	$.ajax(
		{
			type: 		'GET',
			url: 		'ws/estadisticas/mostrardatos',
			dataType: 	'json',
			success: function( data )
			{
				if( data.result )
				{
		            cont1 = 1; cont2 = 1;
					$.each(data.records.ingresos, function(index, value)
		            {
		            	$("#tabla-ingresos").dataTable().fnAddData([ 
		            		cont1++,
		            		value.app.toUpperCase(),
		            		value.movil,
		            		value.web
						]);
		            });

		            $.each(data.records.liberaciones, function(index, value)
		            {
		            	$("#tabla-liberaciones").dataTable().fnAddData([ 
		            		cont2++,
		            		value.app.toUpperCase(),
		            		value.movil,
		            		value.web
						]);
		            });
				}
				else
				{
					console.log(data.message);
				}
			},
			error: function( err )
			{
				console.log();
			}
		});
    }

	$("#ver_por_fecha").on('click', function( e )
	{
		e.preventDefault();
		toastr['warning']('Espere un momento la respuesta de SAP', 'Espere');
	    $.ajax(
	    {
	        type: "GET",
	        url : "ws/estadisticas/contadoringresos",
	        data: { fechainicio:$('#fechainicio').val(), fechafin:$('#fechafin').val() },
	        success : function( result )
        	{
				if( result.result )
				{
		            $("#tabla-ingresos").dataTable().fnClearTable();
		            $("#tabla-liberaciones").dataTable().fnClearTable();
					var cont = 0;
					var cont2 = 0;
					console.log(result.records);
		            $.each(result.records.ingresos, function(index, value)
		            {
		            	cont++;
		            	$("#tabla-ingresos").dataTable().fnAddData([ 
		            		cont,
		            		value.app.toUpperCase(),
		            		value.movil,
		            		value.web
						]);
		            });

		            $.each(result.records.liberaciones, function(index, value)
		            {
		            	cont2++;
		            	$("#tabla-liberaciones").dataTable().fnAddData([ 
		            		cont2,
		            		value.app.toUpperCase(),
		            		value.movil,
		            		value.web
						]);
		            });

					toastr['success']('Ingresos y liberaciones de FIFCOONE consultadas correctamente', 'Éxito');
          		}
		  		else
		  		{
		            $("#tabla-liberaciones").dataTable().fnClearTable();
		            $("#tabla-ingresos").dataTable().fnClearTable();
					toastr['error'](result.message, 'Error');
	            	$("#modal-editar").modal('hide'); 
	          	}      
	          
	        },
	        error: function( data )
        	{
				toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
        	}
		});

		$.ajax(
	    {
	        type: "GET",
	        url : "ws/estadisticas/vacacionessap",
	        data: { fechainicio:$('#fechainicio').val(), fechafin:$('#fechafin').val() },
	        success : function( result )
        	{
				if( result.result )
				{
					if( result.records.length > 0)
					{
			            $("#tabla-liberaciones-sap").dataTable().fnClearTable();
						var cont = 0;
			            $.each(result.records, function(index, value)
			            {
			            	cont++;
			            	$("#tabla-liberaciones-sap").dataTable().fnAddData([ 
			            		cont,
			            		value.UNAME,
			            		value.ENAME,
			            		value.PERNR,
			            		value.BUKRS,
			            		value.DETALLE.UNAME,
			            		value.DETALLE.BEGDA,
			            		value.DETALLE.ENDDA
							]);
			            });
			        	toastr['success']('Vacaciones liberadas desde SAP consultadas correctamente', 'Éxito');
			        }
			        else
			        {
			            $("#tabla-liberaciones-sap").dataTable().fnClearTable();
			        	toastr['info']('No existen vacaciones liberadas desde SAP 	en el rango de fechas seleccionado', 'Información');
			        }
					
          		}
		  		else
		  		{
		            $("#tabla-liberaciones-sap").dataTable().fnClearTable();
					toastr['error'](result.message, 'Error');
	            	$("#modal-editar").modal('hide'); 
	          	}      
	          
	        },
	        error: function( data )
        	{
				toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
        	}
		});
	});
});