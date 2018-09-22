jQuery(document).ready(function($){
	
    window.tabla_registros = $("#tabla-registros").DataTable(
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

    $('#tag_rutas').tagsinput({});
    $('.chosen-select').chosen({ 'search_contains': true, 'width': '100%', 'white-space': 'nowrap', 'allow_single_deselect': true, 'disable_search_threshold':10});

    $.fn.datepicker.dates['en'] = {
        days:        ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        daysShort:   ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
        daysMin:     ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
        months:      ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthsShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
        today: "Today"
    };
    $('.input-date-picker').datepicker({
        format: "yyyy-mm-dd",
        startView: "months",
        orientation: "bottom",
        autoclose: true,
        todayHighlight: true,
        language: 'en',
        endDate: 'today'
    });

    llenarAgentes('#agentes');
    $('#btn-comparar').on('click', llenarTabla);

    function limpia(){
        $("#form-editar").validate().resetForm();
        $('#porcentaje').removeClass('valid');
        $('#porcentaje').removeClass('error');
        $('#km_autorizado').removeClass('valid');
        $('#km_autorizado').removeClass('error');
        $('#pago_km').removeClass('valid');
        $('#pago_km').removeClass('error');
    }

    function llenarAgentes(selector)
    {
        $.ajax(
            {
                type: 		'GET',
                url: 		'ws/kilometraje/reporte/agentes',
                dataType: 	'json',
            })
            .done(function( data )
            {
                if( data.result )
                {
                    $(selector).find('option').remove().end();
                    $.each(data.records, function( index, value )
                    {
                        $(selector).append($("<option />").val(value.pernr_agente).text(value.agente));
                    });

                    $(selector).select2({ });
                }
                else
                    console.log(data.message);
            })
            .fail(function( err )
            {
                console.log( err );
            })
            .always(function() { $('#loader').fadeOut()});
    }


    function llenarTabla(){
        
        var agentes = $('#agentes').val() != null ? $('#agentes').val():"";
        var rutas   = $('#tag_rutas').val() != null ? $('#tag_rutas').val():"";
        var fecha_i = $('#fecha_i').val();
        var fecha_f = $('#fecha_f').val();
        console.log('ws/kilometraje/reporte/kilometrajes?agentes='+ agentes +'&rutas='+rutas+'&fecha_i='+ fecha_i +'&fecha_f='+ fecha_f);
        limpia();
        $('#loader').show();
    	window.tabla_registros.clear().draw();
        if (fecha_i <= fecha_f) {
            $.ajax({
                url: 'ws/kilometraje/reporte/kilometrajes?agentes='+ agentes +'&rutas='+rutas+'&fecha_i='+ fecha_i +'&fecha_f='+ fecha_f,
                type: 'GET',
                dataType: 'json'
            })
            .done(function (response) {
                if (response.result) {
                    cont = 0;
                    $.each(response.records.kilometraje, function (index, value) {
                        $('#teorico').text(response.records.total_teorico + ' km');
                        $('#real').text(response.records.total_real + ' km');
                        col1 = ++cont;
                        col2 = value.ruta;
                        col3 = value.agente;
                        col4 = value.fecha;
                        col5 = value.km_teorico + ' km';
                        col6 = value.km_real+' km';
                        window.tabla_registros.row.add([col1, col2, col3, col4, col5, col6]).draw(false);
                    });
                } else {
                    toastr['warning'](response.message, 'Sin Registros');
                }
            })
            .fail(function (response) {
                toastr['error'](response.message, 'Error');
            })
            .always(function () {
                $('#loader').fadeOut();
            })
        }else{
            toastr['warning']('La fecha inicio debe de ser mayor a la fecha fin', 'Fechas invalidas');
            $('#loader').fadeOut();
        }
    }

	$("#form-editar").validate({
		rules:{
			kilometraje:{
				required: true,
			}
		},
		messages:{
			kilometraje:{
				required: 'Este campo es obligatorio'
			}
		}
	});

});