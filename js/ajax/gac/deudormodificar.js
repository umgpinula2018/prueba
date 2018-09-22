jQuery( document ).ready( function( $ ) 
{
    $('#loader').fadeOut();
    var pais_codigo = '';
    var pais_nombre = '';
    var ov=0;

    $('#IM_USUARIO').val(localStorage.EMPID);
    $('#btn-busqueda').on('click', busqueda);
    $('#tb-busqueda').on('click','.btn-detalle', detalles);
    $('#btn-crear').on('click', store);

    $('.input-date-picker').datepicker({
        format: 'yyyy-mm-dd',
        orientation: "bottom",
        daysOfWeekDisabled: "7",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true
    });
    window.tablaAreas = $("#tb-busqueda").DataTable({
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
    $.ajax({
        type:       'GET',
        url:        'ws/gac/buscar/sociedades?email='+localStorage.USUARIO,
        dataType:   'json',
    })
    .done(function(data){
        if( data.result )
        {
            $('.DD').show();

            if( data.records.LAND1 )
                pais_codigo = data.records.LAND1;
            else
                pais_codigo = data.records.PAIS;

            if( pais_codigo=='GT' )
                pais_nombre='Guatemala';
            if( pais_codigo=='CR' )
                pais_nombre='Costa Rica';
            if( pais_codigo=='SV' )
                pais_nombre='El Salvador';

            $('#pais_usuario').val(pais_codigo);
            switch( pais_codigo )
            {
                case 'CR':
                    $('.A').text('Cédula');
                    $('.B').text('Provincia');
                    $('.C').text('Tipo de Cédula');
                    $('.D').text('Cantón');
                    $('.E').text('Distrito');
                    $('.F').text('Barrio');
                    $('#ZLATITUD').val('10');
                    $('#ZLONG').val('83-');
                break;

                case 'GT':
                    $('.A').text('NIT');
                    $('.B').text('Departamento');
                    $('.C').text('Tipo de NIT');
                    $('.DD').hide();
                    $('.E').text('Municipio');
                    $('.F').text('Zona');
                    $('#ZLATITUD').val('17');
                    $('#ZLONG').val('90-');
                    $('#DEUD_COUNC').remove();
                break;

                case 'SV':
                    $('.A').text('NIT');
                    $('.B').text('Departamento');
                    $('.C').text('Tipo de NIT');
                    $('.DD').hide();
                    $('.E').text('Municipio');
                    $('.F').text('Zona');
                    $('#DEUD_COUNC').remove();
                break;
            }
        }
        else
            toastr['error'](data.message, 'Error');
    }).fail(function(err){
        console.log('Pais no se detectó');
    });

    //Funciones
    function store(e){

        e.preventDefault();

        if( $('#form-crear').valid() ){
            $('#loader').show();

            var imagenId = '';
            var imagenPatente = '';
            var imagenExento = '';
            var IM_ARCHIVOS = '';

            if ($('#form-crear #FOTO_STCD1_1').val() != null && $('#form-crear #FOTO_STCD1_1').val() != "") {
                imagenPersoneria1 = subirArchivos($('#FOTO_STCD1_1'));
                IM_ARCHIVOS += "," + imagenPersoneria1;
            }
            if ($('#form-crear #FOTO_STCD1_2').val() != null && $('#form-crear #FOTO_STCD1_2').val() != "") {
                imagenPersoneria2 = subirArchivos($('#FOTO_STCD1_2'));
                IM_ARCHIVOS += "," + imagenPersoneria2;
            }
            if ($('#form-crear #FOTO_PAAT1_1').val() != null && $('#form-crear #FOTO_PAAT1_1').val() != "") {
                imagenId1 = subirArchivos($('#FOTO_PAAT1_1'));
                IM_ARCHIVOS += "," + imagenId1;
            }
            if ($('#form-crear #FOTO_PAAT1_2').val() != null && $('#form-crear #FOTO_PAAT1_2').val() != "") {
                imagenId2 = subirArchivos($('#FOTO_PAAT1_2'));
                IM_ARCHIVOS += "," + imagenId2;
            }

            $('#form-crear').append("<input type='hidden' name='STR_ARCHIVOS' value='"+IM_ARCHIVOS+"' /> ");

        
            $.ajax({
                type:       'POST',
                url:        'ws/gac/pdv',
                dataType:   'json',
                data:       $('#form-crear').serialize(),
            }).done(function(data){
                if(data.result){
                    toastr['success'](data.message, 'Éxito');
                    $('#modal-detalle').modal('hide');    
                    $('#loader').fadeOut();
                }else{
                    toastr['error'](data.message, 'Error');
                    $('#loader').fadeOut();
                }
            }).fail(function(err){
                console.log(err);
                toastr['error']('Ocurrió un error en la conexion', 'Error');
            }).always( function(all){
                $('#loader').fadeOut();
            });
        }
        else{
            toastr['error']('Hacen falta Datos en la solicitud', 'Error');
            $('#loader').fadeOut();
        }
    }

    function busqueda( e ){
        e.preventDefault();
        
        codigo = $('#buscar').val();
        if( $('#buscar').val())
        {
            $('#loader').show();
            $.ajax({
                        type:       'POST',
                        url:        'ws/gac/deudores/buscar',
                        data:       { buscar:$('#buscar').val(), sociedad: 'FDIS', empid: localStorage.EMPID},
                        // data:       { buscar:$('#buscar').val(), sociedad: localStorage.SOCIEDAD, empid: localStorage.EMPID},
                        success: function( result )
                            {                            
                                if( result.result )
                                {
                                    $.ajax({
                                        type:       'GET',
                                        url:        'ws/gac/codigos/consulta',
                                        dataType:   'json',
                                    })
                                    .done(function(data){
                                        $.each( result.records.TA_INFO_DEUDOR.item, function( index,item ){
                                            $.each( data.records.tipo_id, function( index,value ){

                                                    var correo =item.AD_SMTPADR;
                                                    if(!item.AD_SMTPADR)
                                                        correo='Sin Asignar';

                                                    var tp='Persona Jurídica';
                                                    if( item.STKZN=='X' ){
                                                        tp='Persona Física';
                                                    }

                                                    $("#tb-busqueda").dataTable().fnClearTable();
                                                    $('#tb-busqueda').dataTable().fnAddData([
                                                        item.KUNNR,
                                                        value.valor,
                                                        '<i style="text-transform:capitalize;">'+item.AD_NAME1.toLowerCase()+'</i>',
                                                        tp,
                                                        '<i style="text-transform:capitalize;">'+(item.DEUD_REGIO_DESC.toLowerCase()+', '+item.DEUD_LAND1_DESC.toLowerCase())+'</i>',
                                                        correo,
                                                        '<a data-placement="top" data-bus="Deudor" data-cod="'+item.KUNNR+'" href="#modal-detalle" data-toggle="modal"  title="Editar deudor" class="toltip btn-detalle btn btn-success btn-xs" ><i class="fa fa-pencil "></i> Editar</a>',/*fa-plus*/
                                                    ]);
                                            });

                                        });
                                        
                                        $('#loader').fadeOut();
                                        toastr['success'](result.message, 'Éxito');

                                    }).fail(function(err){
                                        toastr['success'](result.message, 'Éxito');
                                        $('#loader').fadeOut();
                                    });
                                }
                                else
                                {
                                    $("#tb-busqueda").dataTable().fnClearTable();
                                    toastr['success'](result.message, 'Exito');
                                    $('#loader').fadeOut();
                                }
                            },
                        error: function( result )
                            {
                                toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
                                $('#loader').fadeOut();
                            }
                    });
        }
        else
            toastr['error']('Se necesita el codigo o nombre del cliente', 'Error');

    }

    function detalles ( e ){

        e.preventDefault();
        $('#form-crear')[0].reset();
        $('#loader').show();
        
        var cod = $(this).data('cod');

        $.ajax({
            type:       'POST',
            url:        'ws/gac/deudores/buscar',
            dataType:   'json',
            data:       { buscar:cod, sociedad: 'FDIS', empid: localStorage.EMPID },
            // data:       { buscar:cod, sociedad: localStorage.SOCIEDAD, empid: localStorage.EMPID },
        })
        .done(function(data){
        	llenarDEUDOR(data);
        })
        .fail(function(err){
            toastr['error'](err.message, 'Error');
        });
    }

    function llenarDEUDOR(data){

        var deudor = data.records.TA_INFO_DEUDOR.item[0];
        var cedula = deudor.STKZN == '' ? deudor.AD_NAME2_P : deudor.STCD1;

        $('#VKORG').val(deudor.VKORG);
        $('#VTWEG').val(deudor.VTWEG);
        $('#STKZN option[value="'+deudor.STKZN+'"]').attr('selected', 'selected');
        $('#KUNNR').val(deudor.KUNNR);
        $('#AD_NAME1_SHOW').val(deudor.AD_NAME1);
        $('#STCD1_SHOW').val(deudor.STCD1);
        $('#AD_NAMEFIR').val(deudor.AD_NAMEFIR);
        $('#AD_NAMELAS').val(deudor.AD_NAMELAS);
        $('#AD_NAME2_P').val(cedula);
        $('#PAAT1 option[value='+deudor.PAAT1+']').attr('selected', 'selected');
        $('#FOTO_PAAT1').val();
        $('#DEUD_REGIO_SHOW').val(deudor.DEUD_REGIO_DESC);
        $('#DEUD_REGIO').val(deudor.DEUD_REGIO);
        $('#DEUD_COUNC_SHOW').val(deudor.DEUD_COUNC_DESC);
        $('#DEUD_COUNC').val(deudor.DEUD_COUNC);
        $('#DEUD_CITYC_SHOW').val(deudor.DEUD_CITYC_DESC);
        $('#DEUD_CITYC').val(deudor.DEUD_CITYC);
        $('#DEUD_LAND1').val(deudor.DEUD_LAND1);
        $('#CONT_LAND1').val(deudor.CONT_LAND1);
        $('#DEUD_AD_STRSPP2').val(deudor.DEUD_AD_STRSPP2);
        $('#DEUD_AD_STRSPP3').val(deudor.DEUD_AD_STRSPP3);
        $('#DEUD_AD_NAME_CO').val(deudor.DEUD_AD_NAME_CO);
        $('#CONT_TELEF1').val(deudor.CONT_TELEF1);
        $('#CONT_TELEF2').val(deudor.CONT_TELEF2);
        $('#CONT_TELEF3').val(deudor.CONT_TELEF3);
        $('#AD_SMTPADR').val(deudor.AD_SMTPADR);

        cargaSelects(deudor.AD_TITLETX);

        $("#PAAT1").trigger( jQuery.Event("change") ); 
        $("#STKZN").trigger( jQuery.Event("change") ); 

    }

    function cargaSelects(seleccionado){
        
        $.ajax({
            type:       'GET',
            url:        'ws/gac/codigos/consulta',
            dataType:   'json',
        })
        .done(function(data){       
            if( data.result )
            {   
                $('#AD_TITLETX').find('option').remove().end();
                $('#AD_TITLETX').append($("<option />").val('0').text('Seleccione'));
                $.each( data.records.tratamientos, function( index,item ){
                    $('#AD_TITLETX').append('<option class="rutannvv" value="'+item.valor+'" style="text-transform:capitalize;">'+item.valor.toLowerCase()+'</option>');
                });

                $('#AD_TITLETX option[value="'+seleccionado+'"]').attr('selected', 'selected');
            }
            else
                console.log(data.message);  
        })
        .fail(function(err){
            console.log(err);
        })
        .always( function(){
            $('#loader').fadeOut();
        });
    }

    function subirArchivos(selector){

        if( selector != null ){

            var respuesta;
            var data = new FormData();
            data.append("imagen", selector[0].files[0])

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
                    else
                        console.log(data.message)
                },
                error:  function( result )
                {
                    console.log(result.message);
                }
            })
            .always(function(){});

            return respuesta;
        }
    }

    $('#PAAT1').on('change', function(){
        var tipoCedula = $(this).find('option:selected').text();
        $('#PAAT1_SHOW').val(tipoCedula);
    });
        
    $('#STKZN').on('change', function(){
        if( $(this).val() == ""){
            $('#AD_NAME1_SHOW').removeAttr('disabled');
            $('#STCD1_SHOW').removeAttr('disabled');
            $('#infoData').removeClass('hidden');    
        }
        else{
            $('#AD_NAME1_SHOW').attr('disabled', true);
            $('#STCD1_SHOW').attr('disabled', true);
            $('#infoData').addClass('hidden');
        }

    })

    $('#STCD1_SHOW').on('change', function(){
        if( $(this).val() == ""){
            $('#FOTO_STCD1_1').attr('disabled',true);
            $('#FOTO_STCD1_2').attr('disabled',true);
        }
        else{
            $('#FOTO_STCD1_1').removeAttr('disabled');
            $('#FOTO_STCD1_2').removeAttr('disabled');
        }
    });

    $('#AD_NAME2_P').on('change', function(){
        if( $(this).val() == ""){
            $('#FOTO_PAAT1_1').attr('disabled',true);
            $('#FOTO_PAAT1_2').attr('disabled',true);
        }
        else{
            $('#FOTO_PAAT1_1').removeAttr('disabled');
            $('#FOTO_PAAT1_2').removeAttr('disabled');
        }
    })
});
