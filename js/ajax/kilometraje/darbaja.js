jQuery(document).ready(function($){
    localStorage.USUARIO

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
        daysOfWeekDisabled: "7",
        weekHeader: 'Sm',
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true,
        startDate: 'today'
    });
     function limpiar() {
         $('#form-crear')[0].reset();
         $("#form-crear").validate().resetForm();
         $('#agente_uid').removeClass('error');
         $('#agente_uid').removeClass('valid');
         $('#input-supervisor').removeClass('error');
         $('#input-supervisor').removeClass('valid');
         $('#date-inicio').removeClass('error');
         $('#date-inicio').removeClass('valid');
         $('#date-fin').removeClass('error');
         $('#date-fin').removeClass('valid');
     }

     $('#btn-nuevo').on('click', function () {
        limpiar();
     });
    llenarTabla();

    $('#btn-buscar').on('click', buscarAgente);
    $('#btn-crear').on('click', darDeBaja);
    $('#btn-pagos').on('click', pagoKilometraje);

    function llenarTabla(){
        window.tabla_registros.clear().draw();
        $('#loader').show();
        $.ajax({
            url:        'ws/kilometraje/agente/debaja',
            type:       'GET',
            dataType:   'json',
        })
        .done(function(response){
            if (response.result) {
                cont = 0;
                $.each(response.records, function(index, value) {
                    col1 = ++cont;
                    col2 = value.ruta;
                    col3 = value.pernr_agente;
                    col4 = value.uid_agente;
                    col5 = value.fecha_inicio;
                    col6 = value.fecha_fin;
                    col7 = value.km_total+ ' Km';
                    col8 = '₡ '+value.pago;
                    window.tabla_registros.row.add([col1,col2,col3,col4,col5,col6,col7,col8]).draw(false);
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

    function buscarAgente(){
        var agente = $('#agente_uid').val();
        if (agente) {
            $('#loader').show();
            $.ajax({
                url:        'ws/kilometraje/agente/busqueda',
                type:       'POST',
                dataType:   'json',
                data:       {agente_uid: agente}
            })
            .done(function(response){
                if (response.result) {
                    $('#input_supervisor').val(response.records.uid_supervisor);
                    toastr['success'](response.message, 'Éxito');
                    llenarTabla();
                } else {
                    toastr['error'](response.message, 'Error');
                }
            })
            .fail(function(response){
                toastr['error'](response.message, 'Error');
            })
            .always(function(){ $('#loader').fadeOut(); })
        }
    }

    function darDeBaja(){
        var agente       = $('#agente_uid').val();
        var fecha_inicio = $('#date-inicio').val();
        var fecha_fin    = $('#date-fin').val();
        if (fecha_inicio > fecha_fin) {
            toastr['warning']('La fecha  final debe se ser mayor a la fecha de inicio', 'Fecha incorectas');
        }else{
            if ($('#form-crear').valid()) {
                $.ajax({
                    url:        'ws/kilometraje/agente/darbaja',
                    type:       'POST',
                    dataType:   'json',
                    data:       {agente_uid: agente ,fecha_inicio: fecha_inicio ,fecha_fin: fecha_fin}
                })
                .done(function(response){
                    if (response.result) {
                        toastr['success'](response.message, 'Éxito');
                        $("#modal-nuevo").modal('hide');
                        $('#form-crear')[0].reset(); 
                        llenarTabla();
                    } else {
                        console.log(response.message);
                        toastr['warning'](response.message, 'Error');
                    }
                })
                .fail(function(response){
                    toastr['error'](response.message, 'Error');
                })
                .always(function(){ $('#loader').fadeOut(); })
            }
        }
    }

    function pagoKilometraje(){
        var array_id = [];
        if ( $("input:checkbox:checked").length != 0){
            $('#loader').show();
            $("input:checkbox:checked").each(function () {
                array_id.push($(this).data('idregistro'));
            });
            $.ajax({
                url:      'ws/kilometraje/pago/agente/baja?id=' + array_id,
                type:     'GET',
                dataType: 'json',
            })
                .done(function (response) {
                    if (response.result) {
                        toastr['success'](response.message, 'Éxito');
                        $.each(response.records, function (index,value) {
                            if (value.result)
                                console.log('EXITO: '+value.mensaje);
                            else
                                console.log('ERROR: '+value.mensaje);
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
                    llenarTabla();
                })
        } else {
            toastr['warning']('Seleccion a quienes realiza el pago de kilometraje', 'Sin seleccionar');
        }
    }

    $("#form-crear").validate({
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