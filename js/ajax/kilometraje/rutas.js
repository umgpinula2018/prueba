jQuery(document).ready(function ($) {
    var id_registro = 0;

    window.tabla_registros = $("#tabla-registros").DataTable(
        {
            "language":
                {
                    "url": "lang/esp.lang"
                },
            processing: true,
            responsive: true,
            ajax: 'ws/kilometraje/rutas',
            columns: [
                { data: 'DT_Row_Index', name: 'DT_Row_Index', },
                { data: 'ruta', name: 'ruta' },
                { data: 'pernr_supervisor', name: 'pernr_supervisor' },
                { data: 'supervisor', name: 'supervisor' },
                { data: 'uid_supervisor', name: 'uid_supervisor' },
                { data: 'pernr_agente', name: 'pernr_agente' },
                { data: 'agente', name: 'agente' },
                { data: 'uid_agente', name: 'uid_agente' },
                { data: 'tipo', name: 'tipo' },
                { data: 'estado', name: 'estado' },
                { data: 'acciones', name: 'acciones' }
            ]
        });

    $('#loader').show();
    setTimeout(function () { $('#loader').fadeOut() }, 1000);

    $('#btn-actualizar-rutas').on('click', actualizarRutas);
    $('#btn-actualizar').on('click', actualizarKilometraje);
    $('#btn-actualizar-teorico').on('click', actualizarTeorico);
    $('#btn-ingresar-teorico').on('click', ingresarTeorico);
    $('#btn-asignar-suplente').on('click', asiganarSubstitute);
    //$('#btn-cargar').on('click', importar);
    llenarSuplentes('#suplente');

    function actualizarRutas() {

        $('#loader').show();
        $.ajax({
            url: 'ws/kilometraje/lista/rutas',
            type: 'GET',
            dataType: 'json',
        })
            .done(function (response) {
                if (response.result) {
                    toastr['success'](response.message, 'Éxito');
                    window.tabla_registros.ajax.reload();
                } else {
                    toastr['error'](response.message, 'Error');
                }
            })
            .fail(function (response) {
                toastr['error'](response.message, 'Error');
            })
            .always(function () {
                $('#loader').fadeOut();
            });
    }

    function llenarSuplentes(selector) {
        $.ajax(
            {
                type: 'GET',
                url: 'ws/kilometraje/suplentes/disponibles',
                dataType: 'json',
            })
            .done(function (data) {
                if (data.result) {
                    $(selector).find('option').remove().end();
                    $(selector).append($("<option />").val('0').text('Seleccione un suplente'));
                    
                    $.each(data.records, function (index, value) {
                        var type = value.tipo == 1 ? ' - Supervisor de ruta' : '';
                        $(selector).append($("<option />").val(value.id).text(value.usuario.nombre + type));
                    });

                    $(selector).select2({});
                }
                else
                    console.log(data.message);
            })
            .fail(function (err) {
                console.log(err);
            })
            .always(function () { $('#loader').fadeOut() });
    }

    function clear() {
        $('#modal-ingresar-teorico #form-crear')[0].reset();
        $("#modal-ingresar-teorico #form-crear").validate().resetForm();
        $('#modal-ingresar-teorico #kilometraje').removeClass('valid');
        $('#modal-ingresar-teorico #kilometraje').removeClass('error');
    }

    $('#tabla-registros').on('click', 'a.btn-editar', function () {

        id_registro = $(this).data('idregistro');
        $.ajax({
            url: 'ws/kilometraje/rutas/' + id_registro,
            type: 'GET',
            dataType: 'json'
        })
            .done(function (response) {
                if (response.result) {
                    $('#form-editar #type').val(response.records.tipo);
                } else {
                    toastr['error'](response.message, 'Error');
                }
            })
            .fail(function (response) {
                toastr['error'](response.message, 'Error');
            })
            .always(function () {
                $('#loader').fadeOut();
            });
    });

    function actualizarKilometraje() {
        if ($('#form-editar').valid()) {
            $('#loader').show();
            $.ajax({
                url: 'ws/kilometraje/rutas/' + id_registro,
                type: 'PUT',
                dataType: 'json',
                data: $('#form-editar').serialize()
            })
                .done(function (response) {
                    if (response.result) {
                        toastr['success'](response.message, 'Éxito');
                        $("#modal-editar").modal('hide');
                    } else {
                        toastr['error'](response.message, 'Error');
                    }
                })
                .fail(function (response) {
                    toastr['error'](response.message, 'Error');
                })
                .always(function () {
                    $('#loader').hide();
                    window.tabla_registros.ajax.reload();
                });
        }
    }

    function actualizarTeorico() {
        if ($('#form-teorico').valid()) {
            $('#loader').show();
            $.ajax({
                url: 'ws/kilometraje/teoricos/' + $('#id').val(),
                type: 'PUT',
                dataType: 'json',
                data: $('#form-teorico').serialize()
            })
                .done(function (response) {
                    if (response.result) {
                        toastr['success'](response.message, 'Éxito');
                        $('#calendar').fullCalendar('refetchEvents');
                        $("#modal-edit-teorico").modal('hide');
                    } else {
                        toastr['error'](response.message, 'Error');
                    }
                })
                .fail(function (response) {
                    toastr['error'](response.message, 'Error');
                })
                .always(function () {
                    $('#loader').hide();
                });
        }
    }

    function ingresarTeorico() {
        if ($('#form-crear').valid()) {
            $('#loader').show();
            $.ajax({
                url: 'ws/kilometraje/teoricos',
                type: 'POST',
                dataType: 'json',
                data: $('#form-crear').serialize()
            })
                .done(function (response) {
                    if (response.result) {
                        toastr['success'](response.message, 'Éxito');
                        $('#calendar').fullCalendar('refetchEvents');
                        $("#modal-ingresar-teorico").modal('hide');
                    } else {
                        toastr['error'](response.message, 'Error');
                    }
                })
                .fail(function (response) {
                    toastr['error'](response.message, 'Error');
                })
                .always(function () {
                    window.tabla_registros.ajax.reload();
                    $('#loader').hide();
                    clear();
                });
        }
    }

    function importar(e) {
        e.preventDefault();
        if ($('#form-importar').valid()) {
            var data = new FormData($('#form-importar')[0]);
            $.ajax({
                type: "POST",
                url: "ws/kilometraje/importar/teorico",
                data: data,
                dataType: "json",
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.result) {
                        $('#modal-importar').modal('hide');
                        toastr['success'](data.message, 'Éxito');
                    }
                    else {
                        toastr['error'](data.message, 'Espera');
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });
        }
    }

    $("#form-editar").validate({
        rules: {
            kilometraje: {
                required: true
            },
            vehiculo: {
                select: true
            },
            zona: {
                select: true
            }
        },
        messages: {
            kilometraje: {
                required: 'El kilometraje teórico es obligatorio'
            },
            vehiculo: {
                select: 'Debe de selecionar un tipo de vehiculo'
            },
            zona: {
                select: 'Debe de selecionar el tipo de zona'
            }
        }
    });

    $.validator.addMethod('select', function (value) {
        return (value !== '0');
    });

    $('#tabla-registros').on('click', 'a.btn-show', function () {

        id_registro = $(this).data('idregistro');

        var date  = new Date();
        var mm    = date.getMonth()+1;
        var dd    = date.getDate();
        var moth  = mm < 10 ? '0'+mm: mm;
        var day   = dd < 10 ? '0'+dd: dd; 
        var formatDate = date.getFullYear() + '-' + moth + '-' + day;
        
        $('#calendar').fullCalendar('refetchEvents');

        $('#calendar').fullCalendar({
            locale: 'es',
            eventColor: '#c9c142',
            height: 410,
            events: function (start, end, timezone, callback) {
                $.ajax({
                    url: 'ws/kilometraje/teoricos',
                    type: 'GET',
                    dataType: 'json',
                    data: { date: end.format(), ruta: id_registro },
                    success: function (response) {
                        var events = [];
                        $.each(response.records, function (index, value) {
                            events.push({
                                id: value.id,
                                title: value.km_teorico + ' km',
                                start: value.fecha,
                                date: value.fecha
                            });
                        });
                        callback(events);
                    },
                    error: function () {
                        console.log('there was an error while fetching kilomtrajes!');
                    }
                });
            },
            dayClick: function (date, jsEvent, view) {
                var events = $('#calendar').fullCalendar('clientEvents');
                if (date.format() > formatDate) {
                    $('#form-crear #ruta').val(id_registro);
                    $('#form-crear #fecha').val(date.format());
                    if (events.length > 0) {
                        for (var i = 0; i < events.length; i++) {
                            if (moment(date).isSame(moment(events[i].start))) {
                                break;
                            }
                            else if (i == events.length - 1) {
                                $('#modal-ingresar-teorico').modal('show');
                            }
                        }
                    } else {
                        $('#modal-ingresar-teorico').modal('show');
                    }
                } else {
                    toastr['warning']('No puede ingregar el kilometraje teóricos en fechas anteriores', 'Advertencia');
                }
            },
            eventClick: function (event, element) {
                if (event.date > formatDate) {
                    $('#loader').show();
                    $.ajax({
                        url: 'ws/kilometraje/teoricos/' + event.id,
                        type: 'GET',
                        dataType: 'json'
                    })
                        .done(function (response) {
                            if (response.result) {
                                $('#modal-edit-teorico').modal('show');
                                $('#form-teorico #id').val(response.records.id);
                                $('#form-teorico #km_teorico').val(response.records.km_teorico);
                            } else {
                                toastr['error'](response.message, 'Error');
                            }
                        })
                        .fail(function (response) {
                            toastr['error'](response.message, 'Error');
                        })
                        .always(function () {
                            $('#loader').fadeOut();
                        });
                } else {
                    toastr['warning']('El kilometraje de esta fecha no puede ser editado', 'Advertencia');
                }
            }
        });

    });

    $('#tabla-registros').on('click', 'a.btn-asignar', function () {
        id_registro = $(this).data('idregistro');
        listSubstitute(id_registro);
    });

    function listSubstitute(id_registro) {
        $.ajax({
            url: 'ws/kilometraje/lista/suplentes/' + id_registro,
            type: 'GET',
            dataType: 'json'
        })
            .done(function (response) {
                if (response.result) {
                    $('.lists').remove();
                    if (response.records.suplente != null) {
                        var status = response.records.suplente.estado == 1 ? 'Activo' : 'Inactivo'; 
                        var type   = response.records.suplente.tipo   == 1 ? 'Supervisor de ruta' : 'Agente suplente'; 
                        var contenido = '<div class="lists"><div class="w-user-list-item"> <div class="w-user-thumbnail">'+
                                            '<a href="#"><img src="images/perfil.jpg" alt="user"></a>'+
                                        '</div>'+
                                        '<div class="w-user-info">'+
                                            '<ul>'+
                                                '<li>Nombre:<span><a>'+response.records.suplente.nombre+' <span class="label label-success">'+status+'</span></a></span></li>'+
                                                '<li>Email: <span>'+response.records.suplente.email+'</span></li>'+
                                                '<li>Tipo: <span>'+type+'</span></li>'+
                                            '</ul>'+
                                        '</div>'+
                                        '<div class="w-user-action">'+
                                            '<a href="#" class="btn-desasignar" data-tooltip="tooltip" data-placement="left" data-idregistro="'+response.records.id+'" data-original-title="Delete"><i class="fa fa-close"></i></a>'+
                                        '</div></div></div>';
                    
                        $('#contenedor').append(contenido);
                    }
                } else {
                    toastr['error'](response.message, 'Error');
                }
            })
            .fail(function (response) {
                toastr['error'](response.message, 'Error');
            })
            .always(function () {
                $('#loader').fadeOut();
            });
    }

    function asiganarSubstitute() {
        if ($('#form-suplentes').valid()) {
            $('#loader').show();
            $.ajax({
                url:  'ws/kilometraje/asignar/suplentes/'+id_registro,
                type: 'GET',
                dataType: 'json',
                data: $('#form-suplentes').serialize()
            })
                .done(function (response) {
                    if (response.result) {
                        toastr['success'](response.message, 'Éxito');
                        listSubstitute(id_registro);
                        llenarSuplentes('#suplente');
                    } else {
                        toastr['error'](response.message, 'Error');
                    }
                })
                .fail(function (response) {
                    toastr['error'](response.message, 'Error');
                })
                .always(function () {
                    $('#loader').hide();
                });
        }
    }
    
    $('#form-suplentes').on('click', 'a.btn-desasignar', function (event) {
        event.preventDefault();
        id_registro = $(this).data('idregistro');
        $('#loader').show();
        $.ajax({
            url:  'ws/kilometraje/quitar/suplente/'+id_registro,
            type: 'GET',
            dataType: 'json',
            data: $('#form-suplentes').serialize()
        })
            .done(function (response) {
                if (response.result) {
                    toastr['success'](response.message, 'Éxito');
                    listSubstitute(id_registro);
                    llenarSuplentes('#suplente');
                } else {
                    toastr['error'](response.message, 'Error');
                }
            })
            .fail(function (response) {
                toastr['error'](response.message, 'Error');
            })
            .always(function () {
                $('#loader').hide();
            });
    });

});