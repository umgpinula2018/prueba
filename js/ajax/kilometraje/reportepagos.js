jQuery(document).ready(function($){
    

    /*
    *
    *  Calendario de meses
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

    llenarTabla();
    llenarSupervisor('#input-super');
    $('#btn-filtar').on('click', buscarRegistros);
    
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
    
    function llenarTabla(){
        window.tabla_registros.clear().draw();
        $('#loader').show();
        $.ajax({
            url: 		'ws/kilometraje/reporte/pagos/agente',
            type: 		'GET',
            dataType: 	'json'
        })
        .done(function(response){
            if (response.result) {
                cont = 0;
                $.each(response.records, function(index, value) {
                    col1 = ++cont;
                    col2 = value.ruta;
                    col3 = value.fecha;
                    col4 = value.tipo;
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
            toastr['error'](response.message, 'Error');
        })
        .always(function(){ $('#loader').fadeOut(); })
    }

    function buscarRegistros(){
        window.tabla_registros.clear().draw();
        var supervisor = $('#input-super').val() != '0' ? $('#input-super').val(): '';
        $('#loader').show();
        $.ajax({
            url:        'ws/kilometraje/filtar/pagos/agente',
            type:       'POST',
            dataType:   'json',
            data:       {f_mes: $('#date-picker-mes').val(), supervisor_uid: supervisor }
        })
        .done(function(response){
            if (response.result) {
                cont = 0;
                $.each(response.records, function(index, value) {
                    col1 = ++cont;
                    col2 = value.ruta;
                    col3 = value.fecha;
                    col4 = value.tipo;
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
});