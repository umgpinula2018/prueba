jQuery( document ).ready( function( $ )
{	
	//Variables
	var idregistro = 0;
	var ideliminar = 0;
	var subio 	   = false;

	//Propiedades
	llenarSociedades('#sociedad');
	llenarCecos('#cecos');
	llenarUens('#uens');

	$('#loader').fadeOut();
	$('.input-date-picker').datepicker({
		format: 'yyyy-mm-dd',
        orientation: "bottom",
        daysOfWeekDisabled: "7",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true
    });

	window.tabla= $('#tabla-registros').dataTable(
	{
		"order": [[ 7, "desc" ]],
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

	$('.chosen-select').chosen({
		'search_contains': true,
		'width': '100%',
		'white-space': 'nowrap',
		'allow_single_deselect': true,
		'disable_search_threshold': 10,
		allow_single_deselect: true,
		'placeholder_text_single': 'Seleccione una opción'
	});

	function llenarSociedades(selector) {
		$.ajax(
	{
				type: 'GET',
				url: 'ws/sociedades/lista',
				dataType: 'json',
				success: function (data) {
					if (data.result) {
						$(selector).empty();
						$(selector).append('<option value="">Seleccione un sociedad</option>');
						$.each(data.records.TI_SOC.item, function (index, value) {
							$(selector).append('<option value="' + value.BUKRS + '">' + value.BUKRS + ' - ' + value.BUTXT + '</option>');
						});
						$(selector).trigger("chosen:updated");
					}
					else {
						console.log(data.message);
					}
				},
				error: function (err) {
					console.log(err);
				}
			});
	}

	function llenarCecos(selector) {
		$.ajax(
		{
				type: 'GET',
				url: 'ws/cecos/lista',
				dataType: 'json',
			})
			.done(function (data) {
				if (data.result) {
					$(selector).empty();
					$(selector).append('<option value="">Seleccione un CECO</option>');
					$.each(data.records.TI_CECO.item, function (index, value) {
						$(selector).append('<option value="' + value.KOSTL + '">' + value.LTEXT + ' - ' + value.KOSTL + '</option>');
					});
					$(selector).trigger("chosen:updated");
				}
				else
					console.log(data.message);
			})
			.fail(function (err) {
				console.log(err);
			})
			.always(function () { });
				}

	function llenarUens(selector) {
		$.ajax(
			{
				type: 'GET',
				url: 'ws/listauen',
				dataType: 'json',
			})
			.done(function (data) {
				if (data.result) {
					$(selector).empty();
					$(selector).append('<option value="">Seleccione un UEN</option>');
					$.each(data.records.UENS.item, function (index, value) {
						$(selector).append('<option value="' + value.OBJID + '">' + value.OBJID + ' - ' + value.MC_SEARK + '</option>');
					});
					$(selector).trigger("chosen:updated");
			}
				else
					console.log(data.message);
			})
			.fail(function (err) {
				console.log(err);
			})
			.always(function () { });
	}

	$('#btn-consultar').on('click', function( e )
	{
		e.preventDefault();
		console.log($('#filtro').serialize());
		var fechainicio = $('#fecha_inicio').datepicker('getDate');
		var fechafin 	= $('#fecha_fin').datepicker('getDate');
		var sociedad    = $('#sociedad').val() != 0 ? $('#sociedad').val() : '';
		var ceco        = $('#cecos').val() != 0 ? $('#cecos').val() : '';
		var uen         = $('#uens').val() != 0 ? $('#uens').val() : '';
		if (fechafin >= fechainicio) {
			$.ajax(
				{
					type: 'GET',
					url: 'ws/reportes/voluntariados',
					data: {finicio: $('#fecha_inicio').val(), ffin: $('#fecha_fin').val(), sociedad: sociedad, uen: uen, ceco: ceco},
					success: function (result) {
						if (result.result) {

							$("#tabla-registros").dataTable().fnClearTable();
							var cont = 0;
							if (result.records.length > 0) {
								$.each(result.records, function (index, value) {
									cont++;

									if (value.asistencia == 1)
										var asistencia = '<span class="label label-success">Si</span>';
									else
										var asistencia = '<span class="label label-danger">No</span>';

									if (value.cumplidas == "si")
										var cumplidas = '<span class="label label-success">Si</span>';
									else
										var cumplidas = '<span class="label label-danger">No</span>';

									$('#tabla-registros').dataTable().fnAddData([
										cont,
										value.pern_empleado,
										value.empleado,
										value.depto_empleado,
										value.ceco ? value.ceco : '',
										value.sociedad ? value.sociedad : '',
										value.uen ? value.uen : '',
										value.fecha,
										value.objetivos_horas,
										value.totalhoras,
										cumplidas,
										asistencia
									]);
								});
								toastr['success'](result.message, 'Éxito');
							}
							else
								toastr['warning'](result.message, 'Información');
						}
						else {
							$("#tabla-detalle").dataTable().fnClearTable();
							toastr['error'](result.message, 'Error');
						}
					},
					error: function (result) {
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
		var sociedad = $('#sociedad').val() != 0 ?$('#sociedad').val() : '';
		var ceco = $('#cecos').val() != 0 ?$('#cecos').val() : '';
		var uen = $('#uens').val() != 0 ?$('#uens').val() : '';

		if( fechainicio != '' && fechafin !='' )
		{	
			if( $('#fecha_fin').datepicker('getDate') >= $('#fecha_inicio').datepicker('getDate') )
			{
				window.location.href = "ws/exportar/voluntariados?finicio="+fechainicio+"&ffin="+fechafin+"&sociedad="+sociedad+"&ceco="+ceco+"&uen="+uen;
				toastr["success"]("Exportado correctamente", "Éxito");
			}
			else
				toastr["error"]("Fechas invalidas, por favor revisa","Error");
		}
		else
			toastr["error"]("Seleccione fechas por favor","Error");
		
	});

	$('#sociedad').change(function(){
		if ( $('#sociedad').val() != 0 ) {
            $('#cecos').prop('disabled', true).trigger("chosen:updated");
            $('#uens').prop('disabled', true).trigger("chosen:updated");
        }else{
            $('#cecos').prop('disabled', false).trigger("chosen:updated");
            $('#uens').prop('disabled', false).trigger("chosen:updated");
        }
	});

	$('#cecos').change(function(){
		if ( $('#cecos').val() != 0 ) {
            $('#sociedad').prop('disabled', true).trigger("chosen:updated");
            $('#uens').prop('disabled', true).trigger("chosen:updated");
        }else{
            $('#sociedad').prop('disabled', false).trigger("chosen:updated");
            $('#uens').prop('disabled', false).trigger("chosen:updated");
        }
	});

	$('#uens').change(function(){
		if ( $('#uens').val() != 0 ) {
            $('#cecos').prop('disabled', true).trigger("chosen:updated");
            $('#sociedad').prop('disabled', true).trigger("chosen:updated");
        }else{
            $('#cecos').prop('disabled', false).trigger("chosen:updated");
            $('#sociedad').prop('disabled', false).trigger("chosen:updated");
        }
	});
});