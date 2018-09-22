jQuery(document).ready(function($){

    $('#loader').show();
    setTimeout(function () {
        $('#loader').fadeOut();
    },1000);
    
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




    $('#tabla-registros tbody').on( 'click', 'img.icon-delete', function () {
        window.tabla_registros.row( $(this).parents('tr') ).remove().draw();
    } );

    var agente = 0;
    var pago   = 0;
    /*
    *
    *  Traducion de Calendario a español.
    *
    * */

    $.fn.datepicker.dates['en'] = {
        days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        daysShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
        daysMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthsShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
        today: "Today"
    };

    /*
    *
    *  Calendario de meses
    *
    * */

    $('.input-date-picker').datepicker({ 
        format: "yyyy-mm",
        startView: "months", 
        minViewMode: "months",
        orientation: "bottom",
        daysOfWeekDisabled: "7",
        weekHeader: 'Sm',
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true,
    });

    $('#btn-filtar').on('click', buscarRegistros);
    $('#btn-pagos').on('click', tranferirPago);
    llenarSupervisor('#input-super');


    function llenarSupervisor(selector){
        $.ajax(
        {
            type:       'GET',
            url:        'ws/kilometraje/supervisor/rutas',
            dataType:   'json',
        })
        .done(function( data )
        {
            if( data.result )
            {   
                $(selector).find('option').remove().end();
                $(selector).append($("<option />").val('0').text('Seleccione a un supervisor'));
                
                $.each(data.records, function(index, value)
                {
                    $(selector).append($("<option />").val(value.uid_supervisor).text(value.supervisor));
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

    function buscarRegistros(){
        window.tabla_registros.clear().draw();
        var supervisor = $('#input-super').val() != '0' ? $('#input-super').val(): '';
        $('#loader').show();
        $.ajax({
            url:        'ws/kilometraje/registro/pagos',
            type:       'POST',
            dataType:   'json',
            data:       {f_mes: $('#date-picker-mes').val(), supervisor_uid: supervisor }
        })
        .done(function(response){
            if (response.result) {
                cont = 0;
                $.each(response.records, function(index, value) {
                    col1 = '<input  type="checkbox" value="agente" id="agente" data-numeroregistro="'+value.pernr_agente+'" data-pagoregistro="'+value.pago+'" name="agente">';
                    col2 = ++cont;
                    col3 = value.ruta;
                    col4 = value.fecha;
                    col5 = value.pernr_agente;
                    col6 = value.agente;
                    col7 = value.uid_supervisor;
                    col8 = value.kilometraje+' Km';
                    col9 = '₡ '+value.pago;
                    window.tabla_registros.row.add([col1,col2,col3,col4,col5,col6,col7,col8,col9]).draw(false);
                });
            } else {
                toastr['error'](response.message, 'Error');
            }
        })
        .fail(function(response){
            toastr['error']('Ocurrio un problema al procesar la solicitud', 'Error');
        })
        .always(function(){ $('#loader').fadeOut(); })
    }

    function tranferirPago() {
        if ( $("#tabla-registros >tbody >tr").length > 0 ) {
            if( $("input:checkbox:checked").length != 0 ){
                $('#loader').show();
                $("input:checkbox:checked").each(function () {
                    agente = $(this).data('numeroregistro');
                    pago   = $(this).data('pagoregistro');

                   $.ajax({
                        url:      'ws/kilometraje/pago/agente',
                        type:     'POST',
                        dataType: 'json',
                        data:     { numero: agente, mes:$('#date-picker-mes').val(), pago: pago }
                   })
                    .done(function (response) {
                        if (response.result) {
                            toastr['success'](response.message, 'Éxito');
                            $.each(response.records, function (index,value) {
                                if (value.result)
                                    console.log(value.id+' EXITO: '+value.mensaje);
                                else
                                    console.log(value.id+' ERROR: '+value.mensaje);
                            })
                        } else {
                            toastr['error'](response.message, 'Error');
                        }
                    })
                    .fail(function (response) {
                        toastr['error'](response.message, 'Error');
                    })
                    .always(function () {
                        $('#loader').fadeOut();
                        $("#modal-pago").modal('hide');
                    });
                   window.tabla_registros.row( $(this).parents('tr') ).remove().draw();
                });
            } else {
                toastr['warning']('Seleccion a quienes realiza el pago de kilometraje', 'Sin seleccionar');
            }
        }else{
            toastr['warning']('Debe de buscar los kilometrajes que desea pagar','Sin buscar kilometrajes');
        }
    }

});