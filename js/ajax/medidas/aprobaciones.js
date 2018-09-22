jQuery(document).ready(function ($) {

    _.templateSettings = {
      interpolate: /\{\{(.+?)\}\}/g
    }; //Variables del template se ingresarán así: {{nombre_Variable}}
    
    moment.locale("es"); //Se settea el formato de fecha de la librería moment

    var record_id = 0;

    $(document).children('.lazy').Lazy();

    $(document).on('click', '[data-toggle="lightbox"]', function(event) {
        event.preventDefault();
        $(this).ekkoLightbox({
            alwaysShowClose: true,
            onHide: () => {
                $("#detail-modal").css({
                    'overflow-y': 'scroll'
                });
            }
        });
    });

    if($.fn.DataTable) {
        window.tabla_registros = $("#records-table").DataTable({
            'oLanguage': {
                'sLengthMenu':     'Mostrando _MENU_ filas',
                'sSearch':         '',
                'sProcessing':     'Procesando...',
                'sLengthMenu':     'Mostrar _MENU_ registros',
                'sZeroRecords':    'No se encontraron resultados',
                'sEmptyTable':     'Ningún dato disponible en esta tabla',
                'sInfo':           'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
                'sInfoEmpty':      'Mostrando registros del 0 al 0 de un total de 0 registros',
                'sInfoFiltered':   '(filtrado de un total de _MAX_ registros)',
                'sInfoPostFix':    '',
                'sSearch':         'Buscar:',
                'sUrl':            '',
                'sInfoThousands':  '',
                'sLoadingRecords': 'Cargando...',
                'oPaginate': {
                    'sFirst':      'Primero',
                    'sLast':       'Último',
                    'sNext':       'Siguiente',
                    'sPrevious':   'Anterior'
                }
            }
        });
        loadTable();
    }
    else {
        $.when(
            $.getScript('js/jquery.dataTables.js'),
            $.Deferred(function (deferred) {
                $(deferred.resolve);
            })
        ).done(()=>{
            window.tabla_registros = jQuery("#records-table").DataTable({
                'oLanguage': {
                    'sLengthMenu':     'Mostrando _MENU_ filas',
                    'sSearch':         '',
                    'sProcessing':     'Procesando...',
                    'sLengthMenu':     'Mostrar _MENU_ registros',
                    'sZeroRecords':    'No se encontraron resultados',
                    'sEmptyTable':     'Ningún dato disponible en esta tabla',
                    'sInfo':           'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
                    'sInfoEmpty':      'Mostrando registros del 0 al 0 de un total de 0 registros',
                    'sInfoFiltered':   '(filtrado de un total de _MAX_ registros)',
                    'sInfoPostFix':    '',
                    'sSearch':         'Buscar:',
                    'sUrl':            '',
                    'sInfoThousands':  '',
                    'sLoadingRecords': 'Cargando...',
                    'oPaginate': {
                        'sFirst':      'Primero',
                        'sLast':       'Último',
                        'sNext':       'Siguiente',
                        'sPrevious':   'Anterior'
                    }
                }
            });
            loadTable();
        });
    }

    $('#records-table').on('click', 'a.btn-detail', showRecord);
    $('#btn-aprobar').on('click', send_request);
    $('#btn-rechazar').on('click', send_request);
    $('#btn-trasladar').on('click', send_request);
    $("#carta-preliminar").on('hidden.bs.modal', ()=>{
        window.location.reload(true);
    });

    function loadTable() {
        $('#loader').show();
        $.ajax({
            type:   'GET',
            url:    'ws/medidas/solicitudes',
            dataType: 'json'
        }).done(function (response) {

            //Se agregó este try/catch como la solución más rápida para corregir un error en la línea 90, en la cual por alguna extraña razón, muy pero muy esporádicamente falla al intentar borrar la tabla window.tabla_registros.clear() y no se cierra el loader
            try {
                window.tabla_registros.clear().draw(false);
                var records = response.records.map(record=>{ //Filtrar que no hayan campos nulos
                    if(!record.empleado){
                        record.empleado = {
                            EMPID: "",
                            UEN: "",
                            DEPTO: "",
                            PUESTO: ""   
                        }
                    }
                    return record;
                });

                $.each(records, function (index, value) {
                    no_empleado = value.empleado.EMPID;
                    nombre_empleado = value.empleado.NOMBRE;
                    fecha = value.fecha;
                    uen = value.empleado.UEN;
                    departamento = value.empleado.DEPTO;
                    puesto = value.empleado.PUESTO;
                    sancion = value.especifica.descripcion;
                    acciones = "<a href='#' class='btn btn-xs btn-primary btn-detail' data-amonestacion='"+ JSON.stringify(value.falta_amonestacion) +"' data-toggle='modal' data-id='"+value.id+"'>Detalle</a>";

                    window.tabla_registros.row.add([++index, no_empleado, nombre_empleado, fecha, uen, departamento, puesto, sancion, acciones]).draw(false);
                });
            } catch(e) {
                $('#loader').fadeOut();
            }

        }).fail(function (response) {
            toastr['error'](response.message, 'Error');
        }).always(function () {
            $('#loader').fadeOut();
        });
    }
    
    function showRecord (e) {
        e.preventDefault();
        record_id = $(this).data('id');
        const falta_amonestacion = $(this).data('amonestacion');

        $("#attachment-files").empty();
        
        $.ajax({
            type:   'GET',
            url:    'ws/medidas/solicitudes/'+record_id,
            dataType: 'json'
        }).done(function (response) {
            $('#falta_general').val(response.records.general.descripcion);
            $('#falta_especifica').val(response.records.especifica.descripcion);
            $('#fecha').val(moment(response.records.fecha).format('DD[-]MM[-]YYYY'));
            //$("#sancion").val(falta_amonestacion.amonestacion.descripcion);
            html = '';
            json = JSON.parse(response.records.detalle);

            const showAttachmentFiles = (title, fields, tag, container) => {
                const prefix = `<div><h5 style='font-weight: 900;'>${title}</h5></div>`,
                      sufix = "</div>",
                      fields_html = [];
                
                
                if (fields.forEach) {
                    fields.forEach( (field, index) => {
                        if (tag.toLowerCase() == 'img') {
                            fields_html.push(`<a href='${field}' data-toggle="lightbox" data-max-width="900"> <img src='${field}' class='lazy' style='width: 140px;margin-right: 10px;' /> </a>`)
                            return;
                        }
                        if (tag.toLowerCase() == 'video') {
                            fields_html.push(`<p><a href='${field}' data-toggle='lightbox' >Ver vídeo ${(index + 1)}</a></p>`)
                            return;
                        }
                        if (tag.toLowerCase() == 'audio') {
                            fields_html.push(`<p><a href='${field}' data-toggle='lightbox' >Ver audio ${(index + 1)}</a></p>`)
                            return;
                        }
                        if (tag.toLowerCase() == 'document') {
                            fields_html.push(`<a href='${field}' target='_blank'> Documento ${(index + 1)}</a>`);
                        }
                        if (tag.toLowerCase() == 'email') {
                            fields_html.push(`<a href='${field}' target='_blank'> Correo ${(index + 1)}</a>`);
                        }
                        //fields_html.push(`<a href='${field}' target='_blank'> <${tag}>Documento ${(index + 1)}</${tag}></a>`);
                    });
                    $(container).append(prefix + fields_html + sufix);
                }

            };

            if (response.records.imagen.length > 0) {
                const images = response.records.imagen.split(", ")
                showAttachmentFiles("Imágenes", images, 'img', '#attachment-files');
            }
            
            if (response.records.video.length > 0) {
                const videos = response.records.video.split(", ");
                showAttachmentFiles("Videos", videos, "video", "#attachment-files")
            }

            if (response.records.audio.length > 0) {
                const audios = response.records.audio.split(", ");
                showAttachmentFiles("Audios", audios, "audio", "#attachment-files");
            }

            if (response.records.documento.length > 0) {
                const documentos = response.records.documento.split(", ");
                showAttachmentFiles("Documentos", documentos, "document", "#attachment-files");
            }

            if (response.records.email.length > 0) {
                const emails = response.records.email.split(", ");
                showAttachmentFiles('Correos', emails, 'email', "#attachment-files");
            }

            $.each(json, function(index, value){
                if(value.type == 'checkbox-group') {
                    html += '<div class="col-sm-12">';
                    html += '<div class="form-group">';
                    html +=     '<label>'+value.label+'</label>';
                    $.each(value.values, function(a, b){
                        checked = b.selected ? 'checked' : '';
                        html +=     '<div class="checkbox">';
                        html +=         '<label>';
                        html +=         '<input type="checkbox" '+checked+' disabled>';
                        html +=         b.label;
                        html +=         '</label>';
                        html +=     '</div>';
                    });
                    html += '</div>';
                    html += '</div>';
                }
                else if(value.type == 'date') {
                    html += '<div class="col-sm-6">';
                    html += '<div class="form-group">';
                    html +=     '<label>'+value.label+'</label>';
                    html += '<input type="text" name="'+ value.label +'" class="form-control" value="'+ moment(value.value).format('DD[-]MM[-]YYYY') +'" readonly>';
                    html += '</div>';
                    html += '</div>';
                }
                else if(value.type == 'number') {
                    html += '<div class="col-sm-6">';
                    html += '<div class="form-group">';
                    html +=     '<label>'+value.label+'</label>';
                    html +=     '<input type="text" name="'+ value.label +'" class="form-control" value="'+value.value+'" readonly>';
                    html += '</div>';
                    html += '</div>';
                }
                else if(value.type == 'radio-group') {
                    html += '<div class="col-sm-12">';
                    html += '<div class="form-group">';
                    html +=     '<label>'+value.label+'</label>';
                    $.each(value.values, function(a, b){
                        checked = b.selected ? 'checked' : '';
                        html +=     '<div class="radio">';
                        html +=         '<label>';
                        html +=         '<input type="radio" '+checked+' disabled>';
                        html +=         b.label;
                        html +=         '</label>';
                        html +=     '</div>';
                    });
                    html += '</div>';
                    html += '</div>';
                }
                else if(value.type == 'select') {
                    html += '<div class="col-sm-6">';
                    html += '<div class="form-group">';
                    html +=     '<label>'+value.label+'</label>';
                    $.each(value.values, function(a, b){
                        if(b.selected) {
                            html +=     '<input type="text" class="form-control" value="'+b.label+'" readonly />';
                        }
                    });
                    html += '</div>';
                    html += '</div>';
                }
                else if(value.type == 'text') {
                    html += '<div class="col-sm-6">';
                    html += '<div class="form-group">';
                    html +=     '<label>'+value.label+'</label>';
                    html +=     '<input type="text" class="form-control" name="'+ value.label +'" value="'+value.value+'" readonly>';
                    html += '</div>';
                    html += '</div>';
                }
                else if(value.type == 'textarea') {
                    html += '<div class="col-sm-12">';
                    html += '<div class="form-group">';
                    html +=     '<label>'+value.label+'</label>';
                    html +=     '<textarea  class="form-control" name="'+ value.label +'" readonly>'+value.value+'</textarea>';
                    html += '</div>';
                    html += '</div>';
                }
            });
            
            $('#informacion').html(html);

            if( $("#carta_preliminar").hasClass('hidden') == false ) {
                $("#carta_preliminar").addClass('hidden');
                $("#description").removeClass('hidden');
            }

            $("#detail-modal").attr({
                "data-id": record_id,
                "data-amonestacion": JSON.stringify(falta_amonestacion),
                "data-info": JSON.stringify(response.records)
            }).modal();
        }).fail(function (response) {
            toastr['error'](response.message, 'Error');
        }).always(function () {

        });
    }

    function send_request(e) {
        e.preventDefault();
        estado = $(this).data('reg');
        const id = $("#detail-modal").data("id");

        /*if($(this).hasClass('aprobar_carta')) {$(this).removeClass('aprobar_carta'); return; }*/

        if(estado == 1) {
            const {amonestacion, info} = $("#detail-modal").data();
            
            $("#loader .spinner .text h4").text("Generando y Enviando Carta");
            $('#loader').show();

            var xhr = $.ajax({
                url: 'ws/medidas/solicitudes/' + id,
                type: 'PUT',
                dataType: 'json',
                cache: false,
                data: {
                    estado: estado,
                    uid_aprobo: localStorage.USUARIO.toUpperCase(),
                    fecha_aprobacion: moment().format("YYYY[-]MM[-]DD"),
                    sendMail: 'false'
                }
            });

            xhr
            .done((carta)=>{
                if(carta.result) {
                    var $carta = $(carta.records.carta);
                    var clone_carta = carta.records.carta;
                    const empleado = carta.records.empleado;
                    const jefe = carta.records.jefe;


                    $carta.find(".field-to-replace").each((index, field)=>{
                        clone_carta = clone_carta.replace(field.outerHTML, "<span>{{"+ $(field).attr("data-name") +"}}</span>");
                    });

                    $carta.find("p[contenteditable]").each((index, p)=>{
                        clone_carta = clone_carta.replace(p.outerHTML, "<span>"+ p.innerText +"</span>");
                    });

                    //<p style='margin-bottom: 1.5em;'>Atentamente, </p><div><hr style='width: 200px;display: inline-block;border-width: 1px;border-color: #333;margin: 0;' /><p style='margin: 0;'>"+ localStorage.NOMBRE_USUARIO +"</p>
                    clone_carta = clone_carta + `<div style="text-align: left;margin-top: 4em;">
                                                    <p style="margin:0;border-top: 1px solid;display: inline-block;padding-right: 1.5em;padding-top: 0.5em;">${jefe.NOMBRE}</p>
                                                    <p>Florida Bebidas, S.A.</p>
                                                </div>`;

                    var compiled = _.template(clone_carta);

                    var _compiled_carta = compiled({
                        fecha_impresion: moment().format("DD [de] MMMM [de] YYYY"),
                        nombre: info.empleado.NOMBRE,
                        puesto: info.empleado.PUESTO,
                        numero_empleado: info.empleado.UEN,
                        fecha_falta: moment(info.fecha).format("DD [de] MMMM"),
                        falta_general: info.general.descripcion,
                        falta_especifica: info.especifica.descripcion
                    });
                    
                    var sendMail = $.ajax({
                        url: 'ws/medidas/solicitudes/' + id,
                        type: 'PUT',
                        dataType: 'JSON',
                        cache: false,
                        data: {
                            carta: _compiled_carta,
                            estado: 1,
                            jefe: jefe.CORREO,
                            sendMail: true
                        }
                    });

                    sendMail
                    .done((response)=>{

                        if (response.result) {
                            loadTable();
                            toastr['success']('Registro aprobado correctamente', "Éxito");
                            

                            $("#loader .spinner .text h4").text("");
                            $('#loader').fadeOut();

                            $("#carta-preliminar #content").html(_compiled_carta);
                            //$("#carta-preliminar .modal-header").html("<h3>"+ carta.records.falta_amonestacion.amonestacion.descripcion +"</h3>")

                            $("#detail-modal").modal("hide");
                            $("#carta-preliminar").modal();
                        }
                        else {
                            toastr.error('No se pudo guardar la carta correctamente');
                        }
                        $('#loader').fadeOut();

                    })
                    .fail(error=>{
                        console.log(error);
                        toastr.error(error.message, 'Error');
                        $('#loader').fadeOut();
                    });
                }
                else {
                    toastr.warning(carta.message, "Error");
                    $('#loader').fadeOut();
                }
            })
            .fail((error)=>{
                toastr.error(error.message, 'Error');
                $('#loader').fadeOut();
            });
        }
        else if(estado == 2) {
            var xhr = $.ajax({
                url: 'ws/medidas/solicitudes/' + id,
                type: 'PUT',
                dataType: 'json',
                data: {
                    estado: estado
                }
            });
            
            xhr
            .done((response)=>{
                if(response.result) {
                    loadTable();
                    toastr.success(response.message, "Solicitud rechazada");
                    $("#detail-modal").modal("hide");
                    window.location.reload(true);
                }
                else {
                    toastr.warning(response.message, "Solicitud no rechazada");
                }
            })
            .fail((error)=>{
                toastr.error(error.message, 'Ocurrió un error');
                $('#loader').fadeOut();
            });
        }
        else { //TRASLADO LEGAL
            
            var usuario = localStorage.USUARIO;
            var form_falta                  =   $("#form-solicitud").serializeJSON();
            var form_info_adicional_falta   =   $("#form-info-adicional").serializeJSON();
            form_falta.fecha                =   transformDate(form_falta.fecha);

            $("#loader .spinner .text h4").text("Enviando Carta a Gerente Legal");
            $('#loader').show();
            
            var xhr = $.ajax({
                url: 'ws/medidas/solicitudes/' + id,
                type: 'PUT',
                dataType: 'json',
                data: {
                    estado: estado,
                    usuario: usuario.toUpperCase(),
                    solicitud: {
                        falta: form_falta,
                        adicional: form_info_adicional_falta
                    }
                }
            });

            xhr
            .done((data)=>{

                if(data.result) {
                    toastr.success(data.message, 'Correo Enviado');
                    loadTable();
                    $("#detail-modal").modal("hide");
                    window.location.reload(true);
                }
                else {
                    toastr.warning(data.message, 'Correo no enviado');
                }
                $('#loader').fadeOut();
                
            })
            .fail((response)=>{
                toastr.error(response.message, 'Ocurrió un error');
                $('#loader').fadeOut();
            });
        }
    }

    function transformDate(date) {
        var _date_split = date.split("-");
        var _date = `${_date_split[2]}-${_date_split[1]}-${_date_split[0]}`;
        return _date;
    }

});