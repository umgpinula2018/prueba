jQuery( document ).ready( function( $ )
{

    window.tablaSolicitudes = $("#tablaSolicitudes").DataTable({
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

    $('#pais').val(localStorage.PAIS);

    //--------------------------------------------------------EVENTOS--------------------------------------------------------

    cargarRutas();
    $('#btn-busqueda').on('click', solicitudesPendientes);
    $('#btn-aceptar').on('click', enviarPagare);

    $("#tablaSolicitudes").on('click', '.btn-adjuntar', cargarModalAdjuntar);


    //--------------------------------------------------------FUNCIONES------------------------------------------------------

    /* FUNCION DE CARGA DE RUTAS
    Se carga al iniciar la vista, llena el selects de Rutas
    consulta el ws codigosconsulta
     */

    function cargarRutas() {
        $('#loader').show();

        $.ajax({
            type:       'GET',
            url:        'ws/gac/codigos/consulta',
            dataType:   'json'
        })
            .done(function(data){
                if( data.result )
                {
                    $('#ruta').focus();
                    $('#ruta').find('option').remove().end();
                    $('#ruta').append($("<option />").val('0').text('Seleccione una ruta'));

                    $.each(data.records.tipo_rutas, function(index, value){
                        $('#ruta').append($("<option />").val(value.id).text(value.id+' - '+value.valor.toLowerCase()));
                    });

                    $('#ruta').select2({ });
                }
                else{
                    toastr['error']('Error al cargar la información', 'Error');
                }
            })
            .fail(function(err){
                console.log(err);
            })
            .always( function(){
                $('#loader').fadeOut();
            });
    }

    /* FUNCION PARA CARGAR LAS SOLICITUDES PENDIENTES
     parametros de entrada: Pais y Ruta
     Devuelve el listado de las solicitudes pendientes, consumiendo el ws de SAP
    */

    function solicitudesPendientes() {

        var pais = $('#pais').val();
        var ruta = $('#ruta').val();

        if( pais != '' && ruta != 0){

            $('#loader').show();
            window.tablaSolicitudes.clear().draw();

            $.ajax({
                type:       'GET',
                url:        'ws/gac/solicitudes',
                dataType:   'json',
                data:       {pais:pais, ruta:ruta}
            })
            .done(function(data){
                if( data.result )
                {
                    var contador = 0;
                    $.each(data.records.TA_FORMULARIO.item, function(index,value){

                        contador++;
                        counter1 = contador;
                        counter2 = value.CONSEC;
                        counter3 = value.NOMBRE_PDV;
                        counter4 = value.FCREADO;
                        counter5 = value.DES_STATUS;

                        if(value.STATUS == 'J'){
                            counter6 = '<a  class="btn-adjuntar btn btn-primary btn-xs" title="Adjunto foto de pagaré" data-toggle="modal" data-consecutivo="'+value.CONSEC+'">Adjuntar foto</a>';
                        }
                        else{
                            counter6 = '';
                        }

                        window.tablaSolicitudes.row.add([counter1,counter2,counter3,counter4,counter5,counter6]).draw(false);
                    });
                }
                else
                    toastr['error'](data.message, 'Error');
            })
            .fail(function(err){
                console.log(err);
            })
            .always( function(){
                $('#loader').fadeOut();
            });
        }
        else{
            toastr['error']('Error al consultar las solicitudes, ingrese una ruta valida', 'Error');
        }

    }

    /* FUNCION PARA ADJUNTAR FOTO DE PAGARÉ
     parametros de entrada: data-consecutivo
     Realiza una busqueda de formulario mediante el WS busquedas (GACDosController) para obtener el dato de EX_ARCHIVOS
     y luego cargar Modal
     */

    function cargarModalAdjuntar( e ) {

        $('#loader').show();

        limpiarValidacionesInput();

        var sociedad = localStorage.SOCIEDAD;
        var IM_FORMULARIO = $(e.target).closest("a").data("consecutivo");

        $.ajax({
            type:       'GET',
            url:        'ws/gac/busquedas',
            dataType:   'json',
            data:       {tipobusqueda:2, IM_FORMULARIO:IM_FORMULARIO}
        })
        .done(function(data){
            if( data.result )
            {
                $('#url_archivos').val(data.records.EX_ARCHIVOS);
                $('#EX_CONSEC').val(IM_FORMULARIO);

                $('#modal-adjuntar').modal('show');
            }
            else
                toastr['error']('Error al consultar el formulario', 'Error');
        })
        .fail(function(err){
            console.log(err);
        })
        .always( function(){
            $('#loader').fadeOut();
        });
    }

    function enviarPagare() {

        $(this).attr('disable',true);

        $('#loader').show();

        var EX_ARCHIVOS = $('#url_archivos').val();
        var EX_CONSEC = $('#EX_CONSEC').val();
        var STR_ARCHIVOS = '';
        var imagenPagare = '';

        if( EX_ARCHIVOS != '' ) {
            if ($('#form-adjuntar #foto_pagare').val() != null && $('#form-adjuntar #foto_pagare').val() != "") {
                imagenPagare = subirArchivos($('#foto_pagare'));
                EX_ARCHIVOS += "," + imagenPagare;
            }

            $('#form-adjuntar').append("<input type='hidden' name='EX_ARCHIVOS' id='EX_ARCHIVOS' value='"+EX_ARCHIVOS+"' /> ");
        }
        else{
            if ($('#form-adjuntar #foto_pagare').val() != null && $('#form-adjuntar #foto_pagare').val() != "") {
                imagenPagare = subirArchivos($('#foto_pagare'));
                STR_ARCHIVOS += "," + imagenPagare;
            }

            $('#form-adjuntar').append("<input type='hidden' name='STR_ARCHIVOS' id='STR_ARCHIVOS' value='"+STR_ARCHIVOS+"' /> ");
        }

        if( $('#form-adjuntar').valid() )
        {
            $.ajax({
                type:       'POST',
                url:        'ws/gac/pdv',
                dataType:   'json',
                data:       $('#form-nuevo').serialize(),
            })
            .done(function(data) {
                    if(data.result){

                        toastr['success'](data.message, 'Éxito');
                        $('#modal-adjuntar').modal('hide');
                        $('#loader').fadeOut();

                    }else{
                        toastr['error'](data.message, 'Error');
                        $('#loader').fadeOut();
                    }

            })
            .fail(function(err){
                toastr['error'](err.message, 'Error');
            })
            .always( function(all){
                $('#loader').fadeOut();
            });
        }
        else{
            toastr['error']('Debe de completar los campos obligatorios', 'Error');
            $('#loader').fadeOut();
        }
    }

    function subirArchivos(selector){

        if( selector != null ){

            var respuesta;
            var data = new FormData();
            data.append("imagen", selector[0].files[0]);

            $.ajax({
                url:        'ws/gac/cargar/imagen',
                type:       'POST',
                data:        data,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function( data )
                {
                    if( data.result )
                        respuesta = data.records.imagen;
                },
                error:  function( result )
                {
                    console.log(result.message);
                }
            }).always(function(){});

            return respuesta;
        }
    }

    function limpiarValidacionesInput(){
        $('#form-adjuntar')[0].reset();
        $("#form-adjuntar").validate().resetForm();

        $("#form-adjuntar #EX_ARCHIVOS").remove();
        $("#form-adjuntar #STR_ARCHIVOS").remove();

        $('.form-control').removeClass('valid');
        $('.form-control').removeClass('error');
    }
});
