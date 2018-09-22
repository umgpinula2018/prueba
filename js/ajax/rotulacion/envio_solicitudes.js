jQuery(document).ready(function ($){
    var id = 0;

    $('.chosen-select').chosen({
        'search_contains': true,
        'width': '100%',
        'white-space': 'nowrap',
        'allow_single_deselect': true,
        'disable_search_threshold': 10
    });

    $('.datepicker').datepicker({
        format: 'yyyy-mm-dd',
        orientation: "bottom",
        daysOfWeekDisabled: "7",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true,
        startDate: 'today'
    });

    window.tabla_solicitudes = $("#tabla-solicitudes").DataTable(
        {
            "oLanguage": {
                "sLengthMenu": "Mostrando _MENU_ filas",
                "sSearch": "",
                "sProcessing": "Procesando...",
                "sLengthMenu": "Mostrar _MENU_ registros",
                "sZeroRecords": "No se encontraron resultados",
                "sEmptyTable": "Ningún dato disponible en esta tabla",
                "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                "sInfoPostFix": "",
                "sSearch": "Buscar:",
                "sUrl": "",
                "sInfoThousands": ",",
                "sLoadingRecords": "Cargando...",
                "oPaginate": {
                    "sFirst": "Primero",
                    "sLast": "Último",
                    "sNext": "Siguiente",
                    "sPrevious": "Anterior"
                }
            }
        });

    $('#tabla-solicitudes').on('click','a.btn-approve',clear);
    $('#modal-toPass').on('click','#btn-maintenance',sendMaintenance);
    $('#modal-toPass').on('click','#btn-request',sendRequest);

    function clear(){

        $('#create-request')[0].reset();
        $("#create-request").validate().resetForm();

        $('#create-notice')[0].reset();
        $("#create-notice").validate().resetForm();

        $('#descripcion').removeClass('valid');
        $('#descripcion').removeClass('error');

        $('#date').removeClass('valid');
        $('#date').removeClass('error');
        $('#quantity').removeClass('valid');
        $('#quantity').removeClass('error');
        $('#shortText').removeClass('valid');
        $('#shortText').removeClass('error');
        $('#center').removeClass('valid');
        $('#center').removeClass('error');
        $('#price').removeClass('valid');
        $('#price').removeClass('error');
        $('#shopping').removeClass('valid');
        $('#shopping').removeClass('error');
        $('#article').removeClass('valid');
        $('#article').removeClass('error');
        $('#majorAccount').removeClass('valid');
        $('#majorAccount').removeClass('error');
        $('#costCenter').removeClass('valid');
        $('#costCenter').removeClass('error');
        $('#currencyKey').removeClass('valid');
        $('#currencyKey').removeClass('error');

    }

    function fillValores(selector,cliente)
    {
        $.ajax(
            {
                type: 		'GET',
                url: 		'ws/rotulacion/lista/valores',
                dataType: 	'json',
                data: 		{ cliente: cliente, type: 2 },
            })
            .done(function( data )
            {
                if( data.result )
                {
                    $(selector).find('option').remove().end();
                    $.each(data.records, function( index, value )
                    {
                        $(selector).append($("<option />").val(value.Equnr).text(value.Equnr+' - '+value.Eqktx));
                    });

                    $(selector).select2({ });
                }
                else
                    toastr['error'](data.message, 'Error');
            })
            .fail(function( err )
            {
                console.log( err );
            })
            .always(function() { });
    }

    fillTable();

    function fillTable(){
        window.tabla_solicitudes.clear().draw();
        $('#loader').show();
        $.ajax({
            url: 		'ws/rotulacion/listado/envios/solicitudes',
            type: 		'GET',
            dataType: 	'json'
        })
            .done(function(response){
                if (response.result) {

                    var acciones = ''; estado = ''; tipo_rotulacion= '';
                    $.each(response.records, function (index, value) {

                        acciones = '<td>' +
                            '<a class="btn btn-success btn-xs btn-approve" href="#modal-toPass" data-toggle="modal"  data-idrequest="' + value.id + '" title="Actualizar tipo de usuario"><i class="fa fa fa-send-o"></i></a>' +
                            '</td>';

                        switch (parseInt(value.estado)) {
                            case 0:
                                estado = '<span class="label label-default">Pendiente de Arte</span>';
                                break;
                            case 1:
                                estado = '<span class="label label-info">En proceso</span>';
                                break;
                            case 2:
                                estado = '<span class="label label-success">Aprobado</span>';
                                break;
                            case 3:
                                estado = '<span class="label label-danger">Rechazado</span>';
                                break;
                        }

                        switch (parseInt(value.tipo)) {
                            case 1:
                                tipo_rotulacion = '<span class="label label-info">RETIRO DE ROTULACIÓN</span>';
                                break;
                            case 2:
                                tipo_rotulacion = '<span class="label label-info">NUEVA INSTALACIÓN DE ROTULACIÓN</span>';
                                break;
                            case 3:
                                tipo_rotulacion = '<span class="label label-info">MANTENIMIENTO DE ROTULACIÓN</span>';
                                break;
                        }

                        col1 = value.id;
                        col2 = value.nombre;
                        col3 = value.empid;
                        col4 = tipo_rotulacion;
                        col5 = value.requisito === 1 ? '<span class="label label-default">Lineal</span>' : '<span class="label label-default">Especial</span>';
                        col6 = estado;
                        col7 = value.created_at;
                        col8 = acciones;
                        window.tabla_solicitudes.row.add([col1, col2, col3, col4, col5, col6, col7, col8]).draw(false);
                    });
                } else {
                    toastr['error'](response.message, 'Error');
                }
            })
            .fail(function(response){
                toastr['error'](response.message, 'Error');
            })
            .always(function(){ $('#loader').fadeOut();
            });
    }

    $('#tabla-solicitudes').on('click', 'a.btn-approve', function(){
        id = $(this).data('idrequest');

        $.ajax({
            url:        'ws/rotulacion/solicitudes/'+id,
            type:       'GET',
            dataType:   'json'
        })
            .done(function(response){
                if (response.result) {
                    fillValores('#create-request #grups', response.records.cliente);
                    if (response.records.tipo == 2 && response.records.requisito == 2){
                        $('#create-request').hide();
                        $('#create-notice').show();
                        $('#footer').remove();
                        $('.footer').append('<div id="footer"><button id="btn-request" class="btn btn-success" aria-hidden="true">Enviar</button>' +
                                            '<button class="btn btn-danger" data-dismiss="modal" aria-hidden="true">Cerrar</button></div>');
                    } else {
                        $('#create-notice').hide();
                        $('#create-request').show();
                        $('#footer').remove();
                        $('.footer').append('<div id="footer"><button id="btn-maintenance" class="btn btn-success" aria-hidden="true">Enviar</button>' +
                                            '<button class="btn btn-danger" data-dismiss="modal" aria-hidden="true">Cerrar</button></div>');
                    }
                } else {
                    toastr['error'](response.message, 'Error');
                }
            })
            .fail(function(response){
                toastr['error'](response.message, 'Error');
            })
            .always(function(){ $('#loader').fadeOut(); });
    });

    function sendMaintenance(e){
        e.preventDefault();
        if($('#create-request').valid()){
            $('#loader').show();
            $.ajax({
                url:        'ws/rotulacion/crear/aviso/mantenimiento/'+id,
                type:       'POST',
                dataType:   'json',
                data: 		$('#create-request').serialize(),
            })
                .done(function(response){
                    if (response.result) {
                        toastr['success']('Solicitud enviado correctamente', 'Éxito');
                        $("#modal-toPass").modal('hide');
                    } else {
                        toastr['error'](response.message, 'Error');
                        $("#modal-toPass").modal('hide');
                    }
                })
                .fail(function(response){
                    toastr['error'](response.message, 'Error');
                })
                .always(function(){
                    fillTable();
                    $('#loader').fadeOut();
                });
        }
    }

    function sendRequest(e){
        e.preventDefault();
        if($('#create-notice').valid()){
            $('#loader').show();
            $.ajax({
                url:        'ws/rotulacion/crear/solicitud/pedido/'+id,
                type:       'POST',
                dataType:   'json',
                data: 		$('#create-notice').serialize(),
            })
                .done(function(response){
                    if (response.result) {
                        toastr['success']('Solicitud enviado correctamente', 'Éxito');
                        $('#modal-toPass').modal('hide');
                    } else {
                        toastr['error'](response.message, 'Error');
                        $('#modal-toPass').modal('hide');
                    }
                })
                .fail(function(response){
                    toastr['error'](response.message, 'Error');
                })
                .always(function(){
                    fillTable();
                    $('#loader').fadeOut();
                });
        }
    }
});