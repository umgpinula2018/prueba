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

    llenarMotivos('#motivos');
    llenarRutas('#ruta','#agente');

    $('#btn-ingresar').on('click', registrarKilometraje);
    $('#btn-cancelar').on('click', limpiar);

    $.fn.datepicker.dates['en'] = {
        days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        daysShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
        daysMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
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

    function limpiar(){
        $('#form-desbloquear')[0].reset();
        $("#form-desbloquear").validate().resetForm();
        $('#input-ruta').removeClass('error');
        $('#input-ruta').removeClass('valid');
        $('#input-agente').removeClass('error');
        $('#input-agente').removeClass('valid');
        $('#motivos').removeClass('error');
        $('#motivos').removeClass('valid');
        $('#km').removeClass('error');
        $('#km').removeClass('valid');
        $('#justificacion').removeClass('error');
        $('#justificacion').removeClass('valid');
        $('#date').removeClass('valid');
        $('#date').removeClass('error');
    }

    function llenarRutas(selector1, selector2){
        $.ajax(
            {
                type:       'GET',
                url:        'ws/kilometraje/rutas/agentes?supervisor='+localStorage.USUARIO,
                dataType:   'json',
            })
            .done(function( data )
            {
                if( data.result )
                {
                    $(selector1).find('option').remove().end();
                    $(selector1).append($("<option />").val('0').text('Seleccione un ruta'));
                    $(selector2).find('option').remove().end();
                    $(selector2).append($("<option />").val('0').text('Seleccione un agente'));

                    $.each(data.records, function(index, value)
                    {
                        $(selector1).append($("<option />").val(value.ruta).text(value.ruta));
                        $(selector2).append($("<option data-agente='1' />").val(value.pernr_agente).text(value.pernr_agente +' - '+value.agente));

                    });
                    $.each(data.suplentes, function(index, value)
                    {
                        $(selector2).append($("<option data-agente='0' />").val(value.pernr_agente).text(value.pernr_agente +' - '+value.nombre + ' (SUPLENTE)'));

                    });

                    $(selector1).select2({ });
                    $(selector2).select2({ });
                }
                else
                    console.log(data.message);
            })
            .fail(function( err )
            {
                console.log( err );
            })
            .always(function() { $('#loader').fadeOut() });
    }

    function llenarMotivos(selector){
        $.ajax(
        {
            type:       'GET',
            url:        'ws/kilometraje/motivos',
            dataType:   'json',
        })
        .done(function( data )
        {
            if( data.result )
            {   
                $(selector).find('option').remove().end();
                $(selector).append($("<option />").val('0').text('Seleccione un motivo'));
                
                $.each(data.records, function(index, value)
                {
                    $(selector).append($("<option />").val(value.id).text(value.descripcion));
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
        .always(function() { $('#loader').fadeOut() });
    }


    function registrarKilometraje (){
        var date  = new Date();
        var mm    = date.getMonth()+1;
        var moth  = mm < 10 ? '0'+mm: mm ;
        var formatDate = date.getFullYear() + '-' + moth + '-' + date.getDate();
        var agente = $('option:selected','#agente').data('agente');
        if ($('#form-desbloquear').valid()){
            if ($('#date').val() < formatDate) {
                if ($('#motivos').val() != 0){
                    $('#loader').show();
                    $.ajax({
                        type:     'POST',
                        url:      'ws/kilometraje/registro/noingresado',
                        dataType: 'json',
                        data:      $('#form-desbloquear').serialize()+"&is_agente="+agente
                    })
                    .done(function(response)
                    {
                        if (response.result)
                        {
                            toastr['success'](response.message, 'Éxito');
                            llenarMotivos('#motivos');
                            llenarRutas('#ruta','#agente');
                            limpiar();
                        }else {
                            toastr['error'](response.message, 'Error');
                        }
                    })
                    .fail(function(response)
                    {
                        toastr['error'](response.message, 'Error');
                    })
                    .always(function(){
                        $('#loader').fadeOut()
                    });
                } else {
                    toastr['warning']('Debe de seleccionar un motivo antes de enviar el kilometraje','Motivo no seleccionado');
                }
            }else{
                toastr['warning']('No puede ingresar kilometrajes en fecha mayores a la anterior','Fecha no acceptable');
            }
        }
    }
});