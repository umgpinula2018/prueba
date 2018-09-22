jQuery( document ).ready( function( $ )
{
    var codigo='';
    var pais_codigo = '';
    var pais_nombre = '';
    var carga_datos = false;
    var espera = false;

    $('#IM_USUARIO1').val(localStorage.EMPID);
    $('#IM_USUARIO2').val(localStorage.EMPID);
    $('#IM_USUARIO3').val(localStorage.EMPID);

    $('.input-date-picker').datepicker({
        format: 'yyyy-mm-dd',
        orientation: "bottom",
        daysOfWeekDisabled: "7",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true
    });
    
    window.tablaAreas = $("#tb-busqueda").DataTable(
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
    
    mascaras();

    if(!carga_datos)
        cargarRutas();


    $('.buscar').on('click', busqueda);
    $('#tb-busqueda').on('click','.btn-PDV-agregar', agregar);
    $('#tb-busqueda').on('click','.btn-Deudor-agregar', agrego);

    $('#btn-agregar-pdv').on('click', agregarPDV);
    $('#btn-agregar-deudor').on('click', agregarDeudor);
    $('#btn-crear-nuevo').on('click', nuevoPDV);
    $('#btn-agregar-canal-A').on('click', agregarCanal);
    $('#btn-agregar-canal-C').on('click', agregarCanal);
    $('#btn-agregar-canal-G').on('click', agregarCanal);
    $('#btn-cerrar-modal').on('click', cerrarModalCreado);
    
    $('#ampliado').on('change', cambio_persona);
    $('#ampliado_').on('change', cambio_persona_);

    $('#formalizacion_credito_A').on('click', formalizacionCredito);
    $('#formalizacion_credito_C').on('click', formalizacionCredito);
    $('#formalizacion_credito_G').on('click', formalizacionCredito);
    

    $('#BZIRK_A').on('change', grupoprecios);
    $('#BZIRK_C').on('change', grupoprecios);
    $('#BRSCH_A').on('change', grupoprecios);
    $('#BRSCH_C').on('change', grupoprecios);
    $('#BRSCH_A').on('change', infoCredito);
    $('#BRSCH_C').on('change', infoCredito);
    $('#BRSCH_G').on('change', infoCredito);
    $('#EXENTO_A').on('change', bloquearinputfoto);
    $('#EXENTO_C').on('change', bloquearinputfoto);
    $('#DKTXT_A').on('change', habilitarFotoPatente);
    $('#DKTXT_C').on('change', habilitarFotoPatente);
    $('#bus').on('change', mostrarInputBusquedas);


    $('#DEUD_REGIO_A').on('change', cantones);
    $('#REGIO_D' ).on('change', cantones);
    $('#DEUD_COUNC_A' ).on('change', distritos);
    $('#COUNC_D' ).on('change', distritos);

    $('#DEUD_REGIO_B').on('change', cantones);
    $('#DEUD_COUNC_B' ).on('change', distritos);

    $('#REGIO_C').on('change', cantones);
    $('#COUNC_C' ).on('change', distritos);


    $("#tabla_canales_A").on('click', '.btn-eliminarcanal-A', eliminarCanal);
    $("#tabla_canales_C").on('click', '.btn-eliminarcanal-C', eliminarCanal);
    $("#tabla_canales_G").on('click', '.btn-eliminarcanal-G', eliminarCanal);

    function mostrarInputBusquedas(){
        if( $(this).find('option:selected').val() == 'Deudor' ){
            $('#inputRuta').hide();
            $('#btn-buscar').removeClass('hidden');
            $('#buscar').val('');
            $('#ruta').val('');
        }
        else{
            $('#inputRuta').show();
            $('#btn-buscar').addClass('hidden');
            $('#buscar').val('');
            $('#ruta').val('');
        }
    }

    function cambio_persona(){
        if( $('#ampliado').val() == '' ){
            $('#form-nuevo #AD_NAME1').removeAttr('disabled');
            $('#form-nuevo #STCD1').removeAttr('disabled'); 
            $('#form-nuevo #FOTO_STCD1_A1').removeAttr('disabled');
            $('#form-nuevo #FOTO_STCD1_A2').removeAttr('disabled');
        }
        else{
            $("#form-nuevo #AD_NAME1").attr("disabled", "disabled");
            $("#form-nuevo #STCD1").attr("disabled", "disabled"); 
            $('#form-nuevo #FOTO_STCD1_A1').attr("disabled", "disabled"); 
            $('#form-nuevo #FOTO_STCD1_A2').attr("disabled", "disabled");
        }
    }

    function cambio_persona_(){
        if( $('#ampliado_').val() == '' ){
            $("#form-agrego #AD_NAME1_AGREGARDEUDOR").removeAttr("disabled");
            $("#form-agrego #STCD1_AGREGARDEUDOR").removeAttr("disabled"); 
            $('#form-agrego #FOTO_STCD1_B1').removeAttr('disabled');
            $('#form-agrego #FOTO_STCD1_B2').removeAttr('disabled');
        }
        else{
            $("#form-agrego #AD_NAME1_AGREGARDEUDOR").attr("disabled", "disabled");
            $("#form-agrego #STCD1_AGREGARDEUDOR").attr("disabled", "disabled"); 
            $('#form-agrego #FOTO_STCD1_B1').attr("disabled", "disabled"); 
            $('#form-agrego #FOTO_STCD1_B2').attr("disabled", "disabled");
        }
    }

    $('#liclicorsn').on('change', function(e){
        e.preventDefault();
        if( $(this).val()=='S' ){
            $('#liclicor').removeAttr('disabled');
        }else{
            $('#liclicor').attr('disabled','true');
            $('#liclicor').val('');
        }
    })

    $('#liclicssnn').on('change', function(e){
        e.preventDefault();
        if( $(this).val()=='S' ){
            $('#liclicnum').removeAttr('disabled');
        }else{
            $('#liclicnum').attr('disabled','true');
            $('#liclicnum').val('');
        }
    })

    $.ajax({
        type:       'GET',
        url:        'ws/gac/buscar/sociedades?email='+localStorage.USUARIO,
        dataType:   'json'
    })
    .done(function(data){
        if( data.result ){
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
                    $('.C').text('Tipo de ID');
                    $('.D').text('Cantón');
                    $('.E').text('Distrito');
                    $('.F').text('Barrio');
                    $('.H').text('Fotografía ID:');
                    $('.longitud').attr('placeholder', 'Máximo de 82.550000- y mínimo de 85.950000-');
                    $('.latitud').attr('placeholder', 'Máximos de 11.220000 y minímo de 8.040000');
                break;

                case 'GT':
                    $('.A').text('NIT');
                    $('.B').text('Departamento');
                    $('.C').text('Tipo de NIT');
                    $('.DD').hide();
                    $('.E').text('Municipio');
                    $('.F').text('Zona');
                    $('.H').text('Foto NIT');
                break;

                case 'SV':
                    $('.A').text('NIT');
                    $('.B').text('Departamento');
                    $('.C').text('Tipo de NIT');
                    $('.DD').hide();
                    $('.E').text('Municipio');
                    $('.F').text('Zona');
                break;
            }
        }
        else
            toastr['error'](data.message, 'Error');
    }).fail(function(err){
        console.log('Pais no se detectó');
    });

    $('#bus').on('change', function(e){
        if( $('#bus').val()=='PDV' ){
            $('#buscar').attr('placeholder','Nombre o código de PDV');
            $('#buscar').removeAttr('type');
            $('#buscar').attr('type','text');
        }else{
            $('#buscar').attr('placeholder','Código del Deudor');
            $('#buscar').removeAttr('type');
            $('#buscar').attr('type','number');
        }
    });

    function busqueda( e ){
        
        e.preventDefault();
            
        $("#tb-busqueda").dataTable().fnClearTable();
        $('#loader').show();

        if( $('#bus').val()=='Deudor' ){
            
            if( $('#buscar').val())
            {
                $('.dat1').text('Código');
                $('.dat2').text('Tipo Id');
                $('.dat3').text('Nombre');
                $('.dat4').text('Tipo de Deudor');
                $('.dat5').text('Dirección');
                $('.dat6').text('Correo');

                $.ajax({
                    type:       'POST',
                    url:        'ws/gac/deudores/buscar',
                    // data:       { buscar:$('#buscar').val(), sociedad: localStorage.SOCIEDAD, empid: localStorage.EMPID},
                    data:       { buscar:$('#buscar').val(), sociedad: 'FDIS', empid: localStorage.EMPID},
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


                                        var PAAT1 = '';
                                        $.each( data.records.tipo_id, function( index,value ){

                                            if(value.id == item.PAAT1)
                                                PAAT1 = value.valor;
                                        });

                                        $('#tb-busqueda').dataTable().fnAddData([
                                            item.KUNNR,
                                            PAAT1,
                                            '<i style="text-transform:capitalize;">'+item.AD_NAME1.toLowerCase()+'</i>',
                                            item.STKZN == 'X' ? 'Persona Física' : 'Persona Jurídica', 
                                            '<i style="text-transform:capitalize;">'+(item.DEUD_REGIO_DESC.toLowerCase()+', '+item.DEUD_LAND1_DESC.toLowerCase())+'</i>',
                                            item.AD_SMTPADR ? item.AD_SMTPADR : '',
                                            '<a data-placement="top" data-bus="Deudor" data-cedula="'+item.KUNNR+'" href="#modal-agregar" data-toggle="modal"  title="Agregar nuevo PDV a Deudor" class="toltip btn-PDV-agregar btn btn-success btn-xs" ><i class="fa fa-file-o"></i> PDV</a>',/*fa-plus*/
                                        ]);
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
                toastr['error']('Se necesita el codigo o nombre del Deudor', 'Error');
        }
        else{

            $('.dat1').text('Código');
            $('.dat2').text('Tipo de Negocio');
            $('.dat3').text('Nombre');
            $('.dat4').text('Patente');
            $('.dat5').text('Teléfono');
            $('.dat6').text('Dirección');

            $.ajax({
                type:       'POST',
                url:        'ws/gac/pdvs/buscar',
                data:       { buscar:$('#buscar').val(), sociedad: 'FDIS', ruta: $('#ruta').val(), empid: localStorage.EMPID},
                // data:       { buscar:$('#buscar').val(), sociedad: localStorage.SOCIEDAD, ruta: $('#ruta').val(), empid: localStorage.EMPID},
                success: function( result )
                {
                    if( result.result ){
                        $.each( result.records.TA_INFO_PDV.item , function( index,value ){
                            var patente=''; var telefono='';
                            value.DKTXT?patente=value.DKTXT:patente='Sin Patente';
                            if( value.TELF1 && value.TELF1!='0' )
                                telefono=value.TELF1;

                            if( value.TELF2 && value.TELF2!='0' )
                                if( telefono )
                                    telefono=telefono+', '+value.TELF2
                                else
                                    telefono=value.TELF2

                            if( value.TELFX && value.TELFX!='0' )
                                if( telefono )
                                    telefono=telefono+', '+value.TELFX
                                else
                                    telefono=value.TELFX

                            $('#tb-busqueda').dataTable().fnAddData([
                                value.KUNNR,
                                '<span style="text-transform:capitalize;">'+ value.BRSCH_DESC+'</span>',
                                '<i style="text-transform:capitalize;">'+ value.NOMBRE_PDV+'</i>',
                                patente,
                                telefono,
                                '<i style="text-transform:capitalize;">'+(value.REGIO_DESC.toLowerCase()+', '+value.LAND1_DESC.toLowerCase())+'</i>',
                                '<a data-placement="top" data-bus="PDV" data-codigo="'+value.KUNNR+'" href="#modal-agrego" data-toggle="modal"  title="Agregar nuevo Deudor a PDV" class="toltip btn-Deudor-agregar btn btn-success btn-xs" ><i class="fa fa-file-o"></i> Deudor</a>',/*fa-plus*/
                            ]);
                        });

                        $('#loader').fadeOut();
                        toastr['success'](result.message, 'Éxito');
                    }else{
                        $('#loader').fadeOut();
                        toastr['success'](result.message, 'Éxito');
                    }

                },
                error: function( result )
                {
                    toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
                    $('#loader').fadeOut();
                }
            });
        }
    }

    function agregar ( e ){
        e.preventDefault();

        limpiarValidacionesInput();

        $('.P1').text('Nombre Sociedad');
        $('.P2').text('Cédula Jurídica'); 
        $('.P3').text('Tipo doc. jurídico');
        $('.limpiar').val('');

        $('.provincias').remove();
        $('.cantones').remove();
        $('.distritos').remove();

        $('#FOTO_DKTXT_C').attr('disabled',true);
        $('#FOTO_EXENTO_C').attr('disabled',true);

        $('#BRSCH_C').val('').trigger('change');
        $('#BZIRK_C').val('').trigger('change');
        $('#KDGRP_C').val('').trigger('change');
        $('#VTWEG_C').val('').trigger('change');

        $('#COUNC_C').attr('readonly',true);
        $('#CITYC_C').attr('readonly',true);

        $('#ciudad_pdv_').text(pais_nombre);
        $('#LAND1_C').val(pais_codigo);

        $('#lunes_c').val('');
        $('#rol_lunes_c').val('0');
        $('#martes_c').val('');
        $('#rol_martes_c').val('0');
        $('#miercoles_c').val('');
        $('#rol_miercoles_c').val('0');
        $('#jueves_c').val('');
        $('#rol_jueves_c').val('0');
        $('#viernes_c').val('');
        $('#rol_viernes_c').val('0');
        $('#sabado_c').val('');
        $('#rol_sabado_c').val('0');

        cedula = $(this).data('cedula');

        $('#loader').show();

        $.ajax({
            type:       'POST',
            url:        'ws/gac/deudores/buscar',
            data:       {buscar:cedula, sociedad: 'FDIS', empid: localStorage.EMPID},
            // data:       { 'buscar':cedula, sociedad: localStorage.SOCIEDAD, empid: localStorage.EMPID},
        }).done(function(result){
            
            if (result.result) {
                
                var dataDeudor = result.records.TA_INFO_DEUDOR.item[0];

                if(dataDeudor.STKZN == ''){
                    $('#AD_NAME1_I').removeAttr('disabled');
                    $('#STCD1_I').removeAttr('disabled');
                }
                else{
                    $('#AD_NAME1_I').attr('disabled', true);
                    $('#STCD1_I').attr('disabled', true);   
                }
                $('#FOTO_STCD1_C1').attr('disabled',true);
                $('#FOTO_STCD1_C2').attr('disabled',true);
                $('#FOTO_PAAT1_C1').attr('disabled',true);
                $('#FOTO_PAAT1_C2').attr('disabled',true);

                $('#VTWEG_Z').val(dataDeudor.VTWEG);
                $('#VKORG_C').val(dataDeudor.VKORG);
                $('#KUNNR1').val(dataDeudor.KUNNR);
                $('#KUNNR2').text(dataDeudor.KUNNR);
                $('#DEUDOR').val(cedula);
                $('#STKZN_S').text(dataDeudor.STKZN == '' ? 'Persona Jurídica' : 'Persona Física');
                $('#STKZN_I').val(dataDeudor.STKZN);
                $('#AD_NAME1_S').text(dataDeudor.STKZN == '' ? dataDeudor.AD_NAME1 : '');
                $('#AD_NAME1_I').val(dataDeudor.STKZN == '' ? dataDeudor.AD_NAME1 : '');
                $('#STCD1_S').text(dataDeudor.STKZN == '' ? dataDeudor.STCD1 : '');
                $('#STCD1_I').val(dataDeudor.STKZN == '' ? dataDeudor.STCD1 : '');
                $('#AD_TITLETX_S').text(dataDeudor.AD_TITLETX);
                $('#AD_TITLETX_I').val(dataDeudor.AD_TITLETX);
                $('#AD_NAMEFIR_S').text(dataDeudor.AD_NAMEFIR );
                $('#AD_NAMEFIR_I').val(dataDeudor.AD_NAMEFIR );
                $('#AD_NAMELAS_S').text(dataDeudor.AD_NAMELAS );
                $('#AD_NAMELAS_I').val(dataDeudor.AD_NAMELAS );
                $('#AD_NAME2_P_S').text(dataDeudor.STKZN == '' ? dataDeudor.AD_NAME2_P : dataDeudor.STCD1);
                $('#AD_NAME2_P_I').val(dataDeudor.STKZN == '' ? dataDeudor.AD_NAME2_P : dataDeudor.STCD1);
                $('#PAAT1_I').val(dataDeudor.PAAT1);
                $('#DEUD_REGIO_S').text(dataDeudor.DEUD_REGIO_DESC);
                $('#DEUD_REGIO_I').val(dataDeudor.DEUD_REGIO);
                $('#DEUD_COUNC_S').text(dataDeudor.DEUD_COUNC_DESC);
                $('#DEUD_COUNC_I').val(dataDeudor.DEUD_COUNC);
                $('#DEUD_CITYC_S').text(dataDeudor.DEUD_CITYC_DESC);
                $('#DEUD_CITYC_I').val(dataDeudor.DEUD_CITYC);
                $('#DEUD_AD_STRSPP2_S').text(dataDeudor.DEUD_AD_STRSPP3);
                $('#DEUD_AD_STRSPP2_I').val(dataDeudor.DEUD_AD_STRSPP3);
                $('#DEUD_LAND1_I').val(dataDeudor.DEUD_LAND1);
                $('#CONT_LAND1_I').val(dataDeudor.CONT_LAND1);
                $('#DEUD_AD_STRSPP3_S').text(dataDeudor.DEUD_AD_STRSPP3);
                $('#DEUD_AD_STRSPP3_I').val(dataDeudor.DEUD_AD_STRSPP3);
                $('#DEUD_AD_NAME_CO_S').text(dataDeudor.DEUD_AD_NAME_CO);
                $('#DEUD_AD_NAME_CO_I').val(dataDeudor.DEUD_AD_NAME_CO);
                $('#CONT_TELEF1_S').text(dataDeudor.CONT_TELEF1);
                $('#CONT_TELEF1_I').val(dataDeudor.CONT_TELEF1);
                $('#CONT_TELEF2_S').text(dataDeudor.CONT_TELEF2);
                $('#CONT_TELEF2_I').val(dataDeudor.CONT_TELEF2);
                $('#CONT_TELEF3_S').text(dataDeudor.CONT_TELEF3);
                $('#CONT_TELEF3_I').val(dataDeudor.CONT_TELEF3);
                $('#AD_SMTPADR_S').text(dataDeudor.AD_SMTPADR);
                $('#AD_SMTPADR_I').val(dataDeudor.AD_SMTPADR);

                if( dataDeudor.PAAT1 )
                    descripciones( $('#PAAT1_S'), dataDeudor.PAAT1, 'cedula')
                else
                    $('#PAAT1_S').text('');

                provincias('', $('#REGIO_C'), 3);
            }
            else
                toastr['error'](err.message, 'Error');
        }).fail(function(err){
            console.log( err );
        }).always( function(){});
    }

    function agrego(e){

        e.preventDefault();
        limpiarValidacionesInput();

        $('.P1').text('Nombre Sociedad');
        $('.P2').text('Cédula Jurídica'); 
        $('.P3').text('Tipo doc. jurídico'); 
        
        $('.provincias').remove();
        $('.cantones').remove();
        $('.distritos').remove();

        $('#DEUD_LAND1_C').val(pais_codigo);
        $('#CONT_LAND1_C').val(pais_codigo);
        $('#LAND1_C').val(pais_codigo);

        $('#DEUD_LAND1_B').val(pais_codigo);
        $('#CONT_LAND1_B').val(pais_codigo);

        $('#ampliado_ option[value=""]').attr("selected", "selected");
        $("#ampliado_").trigger( jQuery.Event("change") );
        
        provincias( $('#DEUD_REGIO_B'),'',2);

        $('#loader').show();

        var codigo = $(this).data('codigo');
        
        $.ajax({
            type:       'GET',
            url:        'ws/gac/pdvs/buscar',
            dataType:   'json',
            data:       {buscar:codigo, sociedad: 'FDIS', ruta: $('#ruta').val(), empid: localStorage.EMPID},
            // data:       {buscar:codigo, sociedad: localStorage.SOCIEDAD, ruta: $('#ruta').val(), empid: localStorage.EMPID},
        })
        .done(function(data){

            $('#DEUD_COUNC_B').attr('readonly', true)
            $('#DEUD_CITYC_B').attr('readonly', true)

            $('#KUNNRPDV1').val(data.records.TA_INFO_PDV.item[0].KUNNR);
            $('#VKORGPDV').val(data.records.TA_INFO_PDV.item[0].VKORG);
            $('#VTWEGPDV').val(data.records.TA_INFO_PDV.item[0].VTWEG);
            $('#VWERK').val(data.records.TA_INFO_PDV.item[0].VWERK);

            $('#NOMBRE_PDV_B').text(valornulo(data.records.TA_INFO_PDV.item[0].NOMBRE_PDV.toLowerCase(),'0'));
            $('#NOMBRE_PDV_G').val(data.records.TA_INFO_PDV.item[0].NOMBRE_PDV);
            $('#KUNNRPDV2').text(data.records.TA_INFO_PDV.item[0].KUNNR);
            $('#DKTXT_B').text(data.records.TA_INFO_PDV.item[0].DKTXT?data.records.TA_INFO_PDV.item[0].DKTXT:'');
            $('#DKTXT_G').val(data.records.TA_INFO_PDV.item[0].DKTXT);
            $('#DKTXT_LICOR_B').text(data.records.TA_INFO_PDV.item[0].DKTXT_LICOR?data.records.TA_INFO_PDV.item[0].DKTXT_LICOR:'');
            $('#DKTXT_LICOR_G').val(data.records.TA_INFO_PDV.item[0].DKTXT_LICOR);
            $('#BRSCH_B').text(valornulo(data.records.TA_INFO_PDV.item[0].BRSCH_DESC.toLowerCase(),'0'));
            $('#BRSCH_G').val(data.records.TA_INFO_PDV.item[0].BRSCH);
            $('#REGIO_B').text(valornulo(data.records.TA_INFO_PDV.item[0].REGIO_DESC.toLowerCase(),'0'));
            $('#REGIO_G').val(data.records.TA_INFO_PDV.item[0].REGIO);
            $('#COUNC_B').text(valornulo(data.records.TA_INFO_PDV.item[0].COUNC_DESC.toLowerCase(),'0'));
            $('#COUNC_G').val(data.records.TA_INFO_PDV.item[0].COUNC);
            $('#CITYC_B').text(valornulo(data.records.TA_INFO_PDV.item[0].CITYC_DESC.toLowerCase(),'0'));
            $('#CITYC_G').val(data.records.TA_INFO_PDV.item[0].CITYC);
            $('#AD_STRSPP2_B').text(valornulo(data.records.TA_INFO_PDV.item[0].AD_STRSPP2.toLowerCase(),'0'));
            $('#AD_STRSPP2_G').val(data.records.TA_INFO_PDV.item[0].AD_STRSPP2);
            $('#AD_STRSPP3_B').text(valornulo(data.records.TA_INFO_PDV.item[0].AD_STRSPP3.toLowerCase(),'0'));
            $('#AD_STRSPP3_G').val(data.records.TA_INFO_PDV.item[0].AD_STRSPP3);
            $('#LAND1_G').val(data.records.TA_INFO_PDV.item[0].LAND1);
            $('#AD_NAME_CO_B').text(valornulo(data.records.TA_INFO_PDV.item[0].AD_NAME_CO.toLowerCase(),'0'));
            $('#AD_NAME_CO_G').val(data.records.TA_INFO_PDV.item[0].AD_NAME_CO);
            $('#TELF1_B').text(valornulo(data.records.TA_INFO_PDV.item[0].TELF1,'0'));
            $('#TELF1_G').val(data.records.TA_INFO_PDV.item[0].TELF1);
            $('#TELF2_B').text(valornulo(data.records.TA_INFO_PDV.item[0].TELF2,'0'));
            $('#TELF2_G').val(data.records.TA_INFO_PDV.item[0].TELF2);
            $('#TELFX_B').text(valornulo(data.records.TA_INFO_PDV.item[0].TELFX,'0'));
            $('#TELFX_G').val(data.records.TA_INFO_PDV.item[0].TELFX);
            $('#FREC_VISITA_B').text(data.records.TA_INFO_PDV.item[0].FREC_VISITA=='S'?'Si':'No');
            $('#FREC_VISITA_G').val(data.records.TA_INFO_PDV.item[0].FREC_VISITA);
            $('#TERCERIZADO_B').text(' '+data.records.TA_INFO_PDV.item[0].TERCERIZADO=='S'?'Si':'No');
            $('#TERCERIZADO_G').val(data.records.TA_INFO_PDV.item[0].TERCERIZADO);
            $('#IND_TELEVENTA_B').text(' '+data.records.TA_INFO_PDV.item[0].IND_TELEVENTA=='S'?'Si':'No');
            $('#IND_TELEVENTA_G').val(data.records.TA_INFO_PDV.item[0].IND_TELEVENTA);
            $('#BZIRK_G').val(data.records.TA_INFO_PDV.item[0].BZIRK);
            $('#ZLONG_B').text(valornulo(data.records.TA_INFO_PDV.item[0].ZLONG,'0'));
            $('#ZLONG_G').val(data.records.TA_INFO_PDV.item[0].ZLONG);
            $('#ZLATITUD_B').text(valornulo(data.records.TA_INFO_PDV.item[0].ZLATITUD,'0'));
            $('#ZLATITUD_G').val(data.records.TA_INFO_PDV.item[0].ZLATITUD);
            $('#FECHA_1_VISITA_B').text(valornulo(data.records.TA_INFO_PDV.item[0].FECHA_1_VISITA,'0'));
            $('#FECHA_1_VISITA_G').val(data.records.TA_INFO_PDV.item[0].FECHA_1_VISITA);
            $('#TAKLD_B').text(' '+data.records.TAKLD=='1'?'Si':'No');
            $('#TAKLD_G').val(data.records.TAKLD);
            $('#KONDA_G').val(data.records.TA_INFO_PDV.item[0].KONDA);
            $('#KDGRP_G').val(data.records.TA_INFO_PDV.item[0].KDGRP);

            if( data.records.TA_INFO_PDV.item[0].BZIRK )
                descripciones( $('#BZIRK_B'), data.records.TA_INFO_PDV.item[0].BZIRK, 'ruta' )
            else
                $('#BZIRK_B').text('');

            if( data.records.TA_INFO_PDV.item[0].KDGRP )
                descripciones( $('#KDGRP_B'), data.records.TA_INFO_PDV.item[0].KDGRP, 'grupoclientes' )
            else
                $('#KDGRP_B').text('');

            if( data.records.TA_INFO_PDV.item[0].KONDA ){
                pais    = data.records.TA_INFO_PDV.item[0].LAND1;
                ruta    = data.records.TA_INFO_PDV.item[0].BZIRK;
                negocio = data.records.TA_INFO_PDV.item[0].BRSCH;
                grupo   = data.records.TA_INFO_PDV.item[0].KONDA;

                descripcionGrupoPrecios(pais, ruta, negocio, grupo);
            }
            else
                $('#KONDA_B').text('');

            if( data.records.TA_INFO_PDV.item[0].ORDEN_LUNES=='1' ){
                $('#ORDEN_LUNES_B').attr('checked','checked');
                $('#rol_lunes_B').val('1');
            }else{
                $('#ORDEN_LUNES_B').removeAttr('checked');
                $('#rol_lunes_B').val('0');
            }

            if( data.records.TA_INFO_PDV.item[0].ORDEN_MARTES=='1' ){
                $('#ORDEN_MARTES_B').attr('checked','checked');
                $('#rol_martes_B').val('1');
            }else{
                $('#ORDEN_MARTES_B').removeAttr('checked');
                $('#rol_martes_B').val('0');
            }

            if( data.records.TA_INFO_PDV.item[0].ORDEN_MIERCOLES=='1' ){
                $('#ORDEN_MIERCOLES_B').attr('checked','checked');
                $('#rol_miercoles_B').val('1');
            }else{
                $('#ORDEN_MIERCOLES_B').removeAttr('checked');
                $('#rol_miercoles_B').val('0');
            }

            if( data.records.TA_INFO_PDV.item[0].ORDEN_JUEVES=='1' ){
                $('#ORDEN_JUEVES_B').attr('checked','checked');
                $('#rol_jueves_B').val('1');
            }else{
                $('#ROL_JUEVES_B').removeAttr('checked');
                $('#rol_jueves_B').val('0');
            }

            if( data.records.TA_INFO_PDV.item[0].ORDEN_VIERNES=='1' ){
                $('#ORDEN_VIERNES_B').attr('checked','checked');
                $('#rol_viernes_B').val('1');
            }else{
                $('#ROL_VIERNES_B').removeAttr('checked');
                $('#rol_viernes_B').val('0');
            }

            if( data.records.TA_INFO_PDV.item[0].ORDEN_SABADO=='1' ){
                $('#ORDEN_SABADO_B').attr('checked','checked');
                $('#rol_sabado_B').val('1');
            }else{
                $('#ORDEN_SABADO_B').removeAttr('checked');
                $('#rol_sabado_B').val('0');
            }


            $("#BRSCH_G").trigger( jQuery.Event("change") );
        });
    }

    //Completar Inputs de Consultas en Nuevo Deudor en PDV
    function descripciones(selector, dato, tipo){
        
        $.ajax({
            type:       'GET',
            url:        'ws/gac/codigos/consulta',
            dataType:   'json',
        })
        .done(function(result){

            if(tipo == 'ruta'){
                $.each( result.records.tipo_rutas, function( index,value ){
                    if(value.id == dato )
                        selector.text(' '+value.valor);
                });
            }
            if(tipo == 'cedula'){
                $.each( result.records.tipo_id, function( index,value ){
                    if(value.id == dato )
                        selector.text(' '+value.valor);
                });
            }
            if(tipo == 'grupoclientes'){
                $.each( result.records.tipo_grupos, function( index,value ){
                    if(value.id == dato )
                        selector.text(' '+value.valor);
                });
            }

            $('#loader').fadeOut();
            
        }).fail(function(err){
            toastr['error'](err.message, 'Error');
        });
    }

    function descripcionGrupoPrecios(pais, ruta, negocio, grupo){
        $.ajax({
            type:       'GET',
            url:        'ws/gac/grupo/precio',
            dataType:   'json',
            data:       {pais:pais, ruta:ruta, negocio:negocio}
        })
        .done(function(result){

            $.each( result.records.TA_GRUPOPRECIOS.item, function( index,value ){
                if(value.KONDA == grupo )
                    $('#KONDA_B').text(' '+value.VTEXT);
            });

        }).fail(function(err){
            toastr['error'](err.message, 'Error');
        });
    }

    $('#lunes_c').on('change',function(e){   
        $('#rol_lunes_c').val('');
        if( $('#lunes_c').prop('checked') )
            $('#rol_lunes_c').val('1');
        else
            $('#rol_lunes_c').val('0');
    });

    $('#martes_c').on('change',function(e){  
        $('#rol_martes_c').val('');
        if( $('#martes_c').prop('checked') )
            $('#rol_martes_c').val('1');
        else
            $('#rol_martes_c').val('0');
    });

    $('#miercoles_c').on('change',function(e){   
        $('#rol_miercoles_c').val('');
        if( $('#miercoles_c').prop('checked') )
            $('#rol_miercoles_c').val('1');
        else
            $('#rol_miercoles_c').val('0');
    });

    $('#jueves_c').on('change',function(e){  
        $('#rol_jueves_c').val('');
        if( $('#jueves_c').prop('checked') )
            $('#rol_jueves_c').val('1');
        else
            $('#rol_jueves_c').val('0');
    });

    $('#viernes_c').on('change',function(e){ 
        $('#rol_viernes_c').val('');
        if( $('#viernes_c').prop('checked') )
            $('#rol_viernes_c').val('1');
        else
            $('#rol_viernes_c').val('0');
    });

    $('#sabado_c').on('change',function(e){  
        $('#rol_sabado_c').val('');
        if( $('#sabado_c').prop('checked') )
            $('#rol_sabado_c').val('1');
        else
            $('#rol_sabado_c').val('0');
    });

    $('#lunes_d').on('change',function(e){
        $('#rol_lunes_d').val('');
        if( $('#lunes_d').prop('checked') )
            $('#rol_lunes_d').val('1');
        else
            $('#rol_lunes_d').val('0');
    });

    $('#martes_d').on('click',function(e){
        $('#rol_martes_d').val('');
        if( $('#martes_d').prop('checked') )
            $('#rol_martes_d').val('1');
        else
            $('#rol_martes_d').val('0');
    });

    $('#miercoles_d').on('click',function(e){
        $('#rol_miercoles_d').val('');
        if( $('#miercoles_d').prop('checked') )
            $('#rol_miercoles_d').val('1');
        else
            $('#rol_miercoles_d').val('0');
    });

    $('#jueves_d').on('click',function(e){
        $('#rol_jueves_d').val('');
        if( $('#jueves_d').prop('checked') )
            $('#rol_jueves_d').val('1');
        else
            $('#rol_jueves_d').val('0');
    });

    $('#viernes_d').on('click',function(e){
        $('#rol_viernes_d').val('');
        if( $('#viernes_d').prop('checked') )
            $('#rol_viernes_d').val('1');
        else
            $('#rol_viernes_d').val('0');
    });

    $('#sabado_d').on('click',function(e){
        $('#rol_sabado_d').val('');
        if( $('#sabado_d').prop('checked') )
            $('#rol_sabado_d').val('1');
        else
            $('#rol_sabado_d').val('0');
    });

    function agregarPDV(e){
        e.preventDefault();

        var longitud = $('#form-agregar #ZLONG_C').val().split('.');
        var latitud = $('#form-agregar #ZLATITUD_C').val().split('.');
        var grupoprecios = $('#form-agregar #KONDA_C').val();
        var exento = $('#form-agregar #EXENTO_C').val();
        var exentoFoto = $('#form-agregar #FOTO_EXENTO_C').val();
        var exentovalido = false;

        if(exento == '0'  && exentoFoto != '')
            exentovalido = true;
        else {
            if(exento == '1'  && exentoFoto == '')
                exentovalido = true;
        }

        if( $('#form-agregar').valid() ){

            if(grupoprecios != "0" && grupoprecios != "" && grupoprecios != null) {

                if (longitud.length == 2 && latitud.length == 2) {

                    var checkformalizacion = 1;
                    var arrayLimites = Array();

                    if($('#formalizacion_credito_C').is(':checked')){

                        checkformalizacion = 0;

                        $("#tabla_canales_C tbody > tr").each( function(){
                            
                            if($(this).is(":visible")){

                                checkformalizacion += 1;

                                var TIPO_NEGOCIO = $("#BRSCH_C option:selected").val();
                                var VTWEG = $(this).data('vtweg');
                                var VTEXT = $(this).find('td.vtext').text();
                                var LIMITE = parseInt($(this).find("input").val());

                                var item = Object();

                                item.TIPO_NEGOCIO = TIPO_NEGOCIO;
                                item.VTWEG = VTWEG;
                                item.VTEXT = VTEXT;
                                item.LIMITE = LIMITE;

                                arrayLimites.push(item);
                            }

                        });
                    }

                    if( checkformalizacion > 0) {

                        if (exentovalido == true) {

                            $('#loader').show();

                            var imagenId;
                            var imagenPatente;
                            var imagenExento;
                            var limites = null;

                            limites = JSON.stringify(arrayLimites);

                            var IM_ARCHIVOS = '';

                            if ($('#form-agregar #FOTO_STCD1_C1').val() != null && $('#form-agregar #FOTO_STCD1_C1').val() != "") {
                                imagenPersoneria1 = subirArchivos($('#FOTO_STCD1_C1'));
                                IM_ARCHIVOS += "," + imagenPersoneria1;
                            }
                            if ($('#form-agregar #FOTO_STCD1_C2').val() != null && $('#form-agregar #FOTO_STCD1_C2').val() != "") {
                                imagenPersoneria2 = subirArchivos($('#FOTO_STCD1_BC'));
                                IM_ARCHIVOS += "," + imagenPersoneria2;
                            }
                            if ($('#form-agregar #FOTO_PAAT1_C1').val() != null && $('#form-agregar #FOTO_PAAT1_C1').val() != "") {
                                imagenId1 = subirArchivos($('#FOTO_PAAT1_C1'));
                                IM_ARCHIVOS += "," + imagenId1;
                            }
                            if ($('#form-agregar #FOTO_PAAT1_C2').val() != null && $('#form-agregar #FOTO_PAAT1_C2').val() != "") {
                                imagenId2 = subirArchivos($('#FOTO_PAAT1_C2'));
                                IM_ARCHIVOS += "," + imagenId2;
                            }
                            if($('#form-agregar #FOTO_DKTXT_C').val() != null && $('#form-agregar #FOTO_DKTXT_C').val() != ""){
                                imagenPatente = subirArchivos($('#FOTO_DKTXT_C'));
                                IM_ARCHIVOS += "," + imagenPatente;
                            }
                            if($('#form-agregar #FOTO_EXENTO_C').val() != null && $('#form-agregar #FOTO_EXENTO_C').val() != ""){
                                imagenExento = subirArchivos($('#FOTO_EXENTO_C'));
                                IM_ARCHIVOS += "," + imagenExento;
                            }

                            $('#form-agregar').append("<input type='hidden' id='TA_LIMITES_C' name='TA_LIMITES' value='"+limites+"' /> ");
                            $('#form-agregar').append("<input type='hidden' id='STR_ARCHIVOS_C' name='STR_ARCHIVOS' value='"+IM_ARCHIVOS+"' /> ");
                            console.log(IM_ARCHIVOS);
                            /*$.ajax({
                                type:       'POST',
                                url:        'ws/gac/pdv',
                                dataType:   'json',
                                data:       $('#form-agregar').serialize(),
                            })
                            .done(function(data)
                            {
                                 if(data.result){

                                    $('#loader').fadeOut();
                                    $('#modal-agregar').modal('hide');
                                    $('#consecutivo').text(data.message);
                                    $('#modal-creado').modal('show');

                                }else{
                                    toastr['error'](data.message, 'Error');
                                    $('#loader').fadeOut();
                                }
                            }).fail(function(e){
                                toastr['error'](e.message, 'Error');
                                    $('#loader').fadeOut();
                            }).always( function(all){
                                $('#loader').fadeOut();
                            });*/
                        }
                        else
                            toastr['error']('Debe de adjuntar la fotografía de EXENTO', 'Error');
                    }
                    else
                        toastr['error']('Ha  seleccionado la formalización de crédito, debe de agregar por lo menos un canal de crédito o desmarque la formalización de crédito', 'Error');
                }
                else
                    toastr['error']('Solo se permiten valores decimales en latitud y longitud', 'Error');
            }
            else
                toastr['error']('Debe de elegir un grupo de precios, para generarlos debe de seleccionar un tipo de negocio y una ruta válida', 'Error');
            }
        else{
            toastr['error']('Debe de completar los campos obligatorios', 'Error');
            $('#loader').fadeOut();
        }
    }

    function agregarDeudor(e){
        e.preventDefault();
       
         $('#loader').show();
        var arrayLimites = Array();
        var cantLimites = $("#tabla_canales_G tbody > tr").length;
        var limites = null;
        var imagenPersoneria1 = '';
        var imagenPersoneria2 = '';
        var imagenId1 = '';
        var imagenId2 = '';
        var imagenPatente;
        var imagenExento;

        if( $('#form-agrego').valid() )
        {
            var checkformalizacion = 1;

            if($('#formalizacion_credito_G').is(':checked')){

                checkformalizacion = 0;

                $("#tabla_canales_G tbody > tr").each( function(){
                    
                    if($(this).is(":visible")){

                        checkformalizacion += 1;

                        var TIPO_NEGOCIO = $("#BRSCH_G").val();
                        var VTWEG = $(this).data('vtweg');
                        var VTEXT = $(this).find('td.vtext').text();
                        var LIMITE = parseInt($(this).find("input").val());

                        var item = Object();

                        item.TIPO_NEGOCIO = TIPO_NEGOCIO;
                        item.VTWEG = VTWEG;
                        item.VTEXT = VTEXT;
                        item.LIMITE = LIMITE;

                        arrayLimites.push(item);
                    }

                });
            }

            if( checkformalizacion > 0) {

                limites = JSON.stringify(arrayLimites);
                var IM_ARCHIVOS = '';

                if ($('#form-agrego #FOTO_STCD1_B1').val() != null && $('#form-agrego #FOTO_STCD1_B1').val() != "") {
                    imagenPersoneria1 = subirArchivos($('#FOTO_STCD1_B1'));
                    IM_ARCHIVOS += "," + imagenPersoneria1;
                }
                if ($('#form-agrego #FOTO_STCD1_B2').val() != null && $('#form-agrego #FOTO_STCD1_B2').val() != "") {
                    imagenPersoneria2 = subirArchivos($('#FOTO_STCD1_B2'));
                    IM_ARCHIVOS += "," + imagenPersoneria2;
                }
                if ($('#form-agrego #FOTO_PAAT1_B1').val() != null && $('#form-agrego #FOTO_PAAT1_B1').val() != "") {
                    imagenId1 = subirArchivos($('#FOTO_PAAT1_B1'));
                    IM_ARCHIVOS += "," + imagenId1;
                }
                if ($('#form-agrego #FOTO_PAAT1_B2').val() != null && $('#form-agrego #FOTO_PAAT1_B2').val() != "") {
                    imagenId2 = subirArchivos($('#FOTO_PAAT1_B2'));
                    IM_ARCHIVOS += "," + imagenId2;
                }

                $('#form-agrego').append("<input type='hidden' id='TA_LIMITES_B' name='TA_LIMITES' value='"+limites+"' /> ");
                $('#form-agrego').append("<input type='hidden' id='STR_ARCHIVOS_B' name='STR_ARCHIVOS' value='"+IM_ARCHIVOS+"' /> ");
            
                $.ajax({
                    type:       'POST',
                    url:        'ws/gac/pdv',
                    dataType:   'json',
                    data:       $('#form-agrego').serialize(),
                })
                .done(function(data)
                {
                    if(data.result){

                        $('#loader').fadeOut();
                        $('#modal-agrego').modal('hide');  
                        $('#consecutivo').text(data.message);  
                        $('#modal-creado').modal('show');

                    }else{
                        toastr['error'](data.message, 'Error');
                        $('#loader').fadeOut();
                    }
                }).fail(function(err){
                    toastr['error'](err.message, 'Error');
                        $('#loader').fadeOut();
                }).always( function(all){
                    $('#loader').fadeOut();
                });
            }
            else{
                $('#loader').fadeOut();
                toastr['error']('Ha  seleccionado la formalización de crédito, debe de agregar por lo menos un canal de crédito o desmarque la formalización de crédito', 'Error');
            }
        }
        else
        {
            toastr['error']('Hacen falta Datos en la solicitud', 'Error');
            $('#loader').fadeOut();
        }
    }

    function nuevoPDV(e){

        e.preventDefault();

        var longitud = $('#form-nuevo #ZLONG_').val().split('.');
        var latitud = $('#form-nuevo #ZLATITUD_').val().split('.');
        var grupoprecios = $('#form-nuevo #KONDA_A').val();
        var exento = $('#form-nuevo #EXENTO_A').val();
        var exentoFoto = $('#form-nuevo #FOTO_EXENTO_A').val();
        var exentovalido = false;

        if(exento == '0'  && exentoFoto != '')
            exentovalido = true;
        else {
            if(exento == '1'  && exentoFoto == '')
                exentovalido = true;
        }

        if ($('#form-nuevo').valid()) {

            if(grupoprecios != "0" && grupoprecios != "" && grupoprecios != null) {

                if (longitud.length == 2 && latitud.length == 2) {

                    var checkformalizacion = 1;
                    var arrayLimites = Array();

                    if ($('#formalizacion_credito_A').is(':checked')) {

                        checkformalizacion = 0;

                        $("#tabla_canales_A tbody > tr").each(function () {

                            if ($(this).is(":visible")) {

                                checkformalizacion += 1;

                                var TIPO_NEGOCIO = $("#BRSCH_A option:selected").val();
                                var VTWEG = $(this).data('vtweg');
                                var VTEXT = $(this).find('td.vtext').text();
                                var LIMITE = parseInt($(this).find("input").val());

                                var item = Object();

                                item.TIPO_NEGOCIO = TIPO_NEGOCIO;
                                item.VTWEG = VTWEG;
                                item.VTEXT = VTEXT;
                                item.LIMITE = LIMITE;

                                arrayLimites.push(item);
                            }
                        });
                    }

                    if( checkformalizacion > 0) {

                         if(exentovalido == true){

                            $('#loader').show();

                            var imagenPersoneria1 = '';
                            var imagenPersoneria2 = '';
                            var imagenId1 = '';
                            var imagenId2 = '';
                            var imagenPatente = '';
                            var imagenExento = '';
                            var limites = null;

                            limites = JSON.stringify(arrayLimites);

                            var IM_ARCHIVOS = '';

                            if ($('#form-nuevo #FOTO_STCD1_A1').val() != null && $('#form-nuevo #FOTO_STCD1_A1').val() != "") {
                                imagenPersoneria1 = subirArchivos($('#FOTO_STCD1_A1'));
                                IM_ARCHIVOS += "," + imagenPersoneria1;
                            }
                            if ($('#form-nuevo #FOTO_STCD1_A2').val() != null && $('#form-nuevo #FOTO_STCD1_A2').val() != "") {
                                imagenPersoneria2 = subirArchivos($('#FOTO_STCD1_A2'));
                                IM_ARCHIVOS += "," + imagenPersoneria2;
                            }
                            if ($('#form-nuevo #FOTO_PAAT1_A1').val() != null && $('#form-nuevo #FOTO_PAAT1_A1').val() != "") {
                                imagenId1 = subirArchivos($('#FOTO_PAAT1_A1'));
                                IM_ARCHIVOS += "," + imagenId1;
                            }
                            if ($('#form-nuevo #FOTO_PAAT1_A2').val() != null && $('#form-nuevo #FOTO_PAAT1_A2').val() != "") {
                                imagenId2 = subirArchivos($('#FOTO_PAAT1_A2'));
                                IM_ARCHIVOS += "," + imagenId2;
                            }
                            if ($('#form-nuevo #FOTO_DKTXT_A').val() != null && $('#form-nuevo #FOTO_DKTXT_A').val() != "") {
                                imagenPatente = subirArchivos($('#FOTO_DKTXT_A'));
                                IM_ARCHIVOS += "," + imagenPatente;
                            }
                            if ($('#form-nuevo #FOTO_EXENTO_A').val() != null && $('#form-nuevo #FOTO_EXENTO_A').val() != "") {
                                imagenExento = subirArchivos($('#FOTO_EXENTO_A'));
                                IM_ARCHIVOS += "," + imagenExento;
                            }

                            $('#form-nuevo').append("<input type='hidden' id='TA_LIMITES_A' name='TA_LIMITES' value='" + limites + "' /> ");
                            $('#form-nuevo').append("<input type='hidden' id='STR_ARCHIVOS_A' name='STR_ARCHIVOS' value='" + IM_ARCHIVOS + "' /> ");

                             $.ajax({
                                type: 'POST',
                                url: 'ws/gac/pdv',
                                dataType: 'json',
                                data: $('#form-nuevo').serialize(),
                            }).done(function (data) {
                                if (data.result) {

                                    $('#loader').fadeOut();
                                    $('#modal-nuevo').modal('hide');
                                    $('#consecutivo').text(data.message);
                                    $('#modal-creado').modal('show');

                                } else {
                                    toastr['error'](data.message, 'Error');
                                    $('#loader').fadeOut();
                                }
                            }).fail(function (err) {
                                console.log(err);
                                toastr['error'](err.message, 'Error');
                            }).always(function (all) {
                                $('#loader').fadeOut();
                            });

                        }
                        else
                            toastr['error']('Debe de adjuntar la fotografía de EXENTO', 'Error');
                    }
                    else
                        toastr['error']('Ha seleccionado la formalización de crédito, debe de agregar por lo menos un canal de crédito o desmarque la formalización de crédito', 'Error');
                }
                else
                    toastr['error']('Solo se permiten valores decimales en latitud y longitud', 'Error');
            }
            else
                toastr['error']('Debe de elegir un grupo de precios, para generarlos debe de seleccionar un tipo de negocio y una ruta válida', 'Error');
        }
        else {
            toastr['error']('Debe de completar los campos obligatorios', 'Error');
            $('#loader').fadeOut();
        }
    }

    $('#btn-crear').on('click', function(e){
        e.preventDefault();

        if(espera) {
            alert("Se esta cargando la información, espera unos segundos");
        }
        else {

            limpiarValidacionesInput();

            $('#modal-nuevo').modal('show');
            $('#loader').show();
            $('.limpiar').val('');
            $(".check").prop('checked', false);
            $('#rut_nuev').remove();

            $('#DEUD_LAND1_C').val(pais_codigo);
            $('#CONT_LAND1_C').val(pais_codigo);
            $('#LAND1_D').val(pais_codigo);

            $('#ampliado option[value=""]').attr("selected", "selected");
            $('#PAAT1_A option[value=""]').attr("selected", "selected");
            $('#AD_TITLETX_A option[value=""]').attr("selected", "selected");
            $('#BRSCH_A').val('').trigger('change');
            $('#BZIRK_A').val('').trigger('change');
            $('#KDGRP_A').val('').trigger('change');
            $('#VTWEG_A').val('').trigger('change');

            $('#DEUD_COUNC_A').attr('readonly',true);
            $('#DEUD_CITYC_A').attr('readonly',true);
            $('#COUNC_D').attr('readonly',true);
            $('#CITYC_D').attr('readonly',true);
            $('#KONDA_A').find('option').remove().end();

            $('#FOTO_DKTXT_A').attr('disabled',true);
            $('#FOTO_EXENTO_A').attr('disabled',true);

            $('#btn-agregar-canal').attr("disabled", true);
            
            provincias($('#DEUD_REGIO_A'), $('#REGIO_D'), 1);

            $("#tb-busqueda").dataTable().fnClearTable();

            $('.provincias').remove();
            $('.cantones').remove();
            $('.distritos').remove();

            $("#ampliado").trigger( jQuery.Event("change") );
        }
    });

    /*
    **FUNCION PARA CARGAR RUTAS
    **Se ejecuta al iniciar a vista
    */

    function cargarRutas(){

        carga_datos = true;
        espera = true;
        $('#loader').show();
        
        $.ajax({
            type:       'GET',
            url:        'ws/gac/codigos/consulta',
            dataType:   'json',
        })
        .done(function(data){       
            if( data.result )
            {   
                $('#ruta').focus();
                $('#ruta').find('option').remove().end();
                $('#ruta').append($("<option />").val('').text('Seleccione una ruta'));

                $('#BZIRK_A').find('option').remove().end();
                $('#BZIRK_C').find('option').remove().end();
                $('#BZIRK_A').append($("<option />").val('').text('Seleccione'));
                $('#BZIRK_C').append($("<option />").val('').text('Seleccione'));
                $.each(data.records.tipo_rutas, function(index, value){
                    $('#ruta').append($("<option />").val(value.id).text(value.id+' - '+value.valor.toLowerCase()));
                    $('#BZIRK_A').append('<option class="rutas" value="'+value.id+'" style="text-transform:capitalize;">'+value.id+' - '+value.valor.toLowerCase()+'</option>');
                    $('#BZIRK_C').append('<option class="rutas" value="'+value.id+'" style="text-transform:capitalize;">'+value.id+' - '+value.valor.toLowerCase()+'</option>');
                });
                
                $('#ruta').select2({ });
                $('#BZIRK_A').select2({ });
                $('#BZIRK_C').select2({ });

                $('#PAAT1_A').find('option').remove().end();
                $('#PAAT1_B').find('option').remove().end();
                $('#PAAT1_A').append($("<option />").val('').text('Seleccione'));
                $('#PAAT1_B').append($("<option />").val('').text('Seleccione'));
                $.each( data.records.tipo_id, function( index,item ){
                    $('#PAAT1_A').append('<option class="tiposid" value="'+item.id+'" style="text-transform:capitalize;">'+item.valor.toLowerCase()+'</option>');
                    $('#PAAT1_B').append('<option class="tiposid" value="'+item.id+'" style="text-transform:capitalize;">'+item.valor.toLowerCase()+'</option>');
                });

                $('#AD_TITLETX_A').find('option').remove().end();
                $('#AD_TITLETX_B').find('option').remove().end();
                $('#AD_TITLETX_A').append($("<option />").val('').text('Seleccione'));
                $('#AD_TITLETX_B').append($("<option />").val('').text('Seleccione'));
                $.each( data.records.tratamientos, function( index,item ){
                    $('#AD_TITLETX_A').append('<option class="tratamientos" value="'+item.valor+'" style="text-transform:capitalize;">'+item.valor.toLowerCase()+'</option>');
                    $('#AD_TITLETX_B').append('<option class="tratamientos" value="'+item.valor+'" style="text-transform:capitalize;">'+item.valor.toLowerCase()+'</option>');
                });

                $('#BRSCH_A').find('option').remove().end();
                $('#BRSCH_C').find('option').remove().end();
                $('#BRSCH_A').append($("<option />").val('').text('Seleccione'));
                $('#BRSCH_C').append($("<option />").val('').text('Seleccione'));
                $.each( data.records.tipo_negocio, function( index,item ){
                    $('#BRSCH_A').append('<option class="negocios" value="'+item.id+'" style="text-transform:capitalize;">'+item.id+' - '+item.valor.toLowerCase()+'</option>');
                    $('#BRSCH_C').append('<option class="negocios" value="'+item.id+'" style="text-transform:capitalize;">'+item.id+' - '+item.valor.toLowerCase()+'</option>');
                });

                $('#BRSCH_A').select2({ });
                $('#BRSCH_C').select2({ });

                $('#KDGRP_A').find('option').remove().end();
                $('#KDGRP_C').find('option').remove().end();
                $('#KDGRP_A').append($("<option />").val('').text('Seleccione'));
                $('#KDGRP_C').append($("<option />").val('').text('Seleccione'));
                $.each( data.records.tipo_grupos, function( index,item ){
                    $('#KDGRP_A').append('<option class="grupoclientes" value="'+item.id+'" style="text-transform:capitalize;">'+item.id+' - '+item.valor.toLowerCase()+'</option>');
                    $('#KDGRP_C').append('<option class="grupoclientes" value="'+item.id+'" style="text-transform:capitalize;">'+item.id+' - '+item.valor.toLowerCase()+'</option>');
                });

                $('#KDGRP_A').select2({ });
                $('#KDGRP_C').select2({ });

                $('#VTWEG_A').find('option').remove().end();
                $('#VTWEG_C').find('option').remove().end();
                $('#VTWEG_G').find('option').remove().end();
                $('#VTWEG_A').append($("<option />").val('').text('Seleccione'));
                $('#VTWEG_C').append($("<option />").val('').text('Seleccione'));
                $('#VTWEG_G').append($("<option />").val('').text('Seleccione'));
                $.each( data.records.canales, function( index,item ){
                    $('#VTWEG_A').append('<option class="canales" value="'+item.id+'" style="text-transform:capitalize;">'+item.valor.toLowerCase()+'</option>');
                    $('#VTWEG_C').append('<option class="canales" value="'+item.id+'" style="text-transform:capitalize;">'+item.valor.toLowerCase()+'</option>');
                    $('#VTWEG_G').append('<option class="canales" value="'+item.id+'" style="text-transform:capitalize;">'+item.valor.toLowerCase()+'</option>');
                });
            }
            else
                toastr['error']('Error al cargar la información', 'Error');
        })
        .fail(function(err){
            console.log(err);
        })
        .always( function(){
            $('#loader').fadeOut();
            espera = false;
        });
    }

     /*
    **FUNCION DE GRUPO PRECIOS
    **Se ejecuta en el evente click del boton #btn-crear
    */
    function grupoprecios(){

        indicador = $(this).attr('id').split('_')[1];
        
        var ruta     = $('#BZIRK'+'_'+indicador).val();
        var negocio  = $('#BRSCH'+'_'+indicador).val();
        var selector = $('#KONDA'+'_'+indicador);

        if(ruta > 0 && negocio > 0){
            $.ajax({
                type:       'GET',
                url:        'ws/gac/grupo/precio',
                dataType:   'json',
                data:       {pais:pais_codigo, ruta:ruta, negocio:negocio}
            })
            .done(function(data)
            {
                if( data.result )
                {
                    selector.find('option').remove().end();
                    selector.append($("<option />").val('').text('Seleccione...'));

                    $.each(data.records.TA_GRUPOPRECIOS.item, function(index, value)
                    {
                        selector.append($("<option />").val(value.KONDA).text(value.VTEXT));
                    });
                }
                else
                    toastr['error']('No se han encontrado Grupos de Precios, revise el tipo de negocio y la ruta', 'Error');
            }).fail(function(err){
                console.log( err );
            }).always( function(){
            });
        }
    }

    /*
    **FUNCION DE PROVICIAS
    **Se ejecuta en el evente click del boton #btn-crear
    **Parametros: Selectores y vista modal
    */
    function provincias( deud_regio, regio, modal ){

        $.ajax({
            type:       'GET',
            url:        'ws/gac/provincia',
            dataType:   'json',
            data:       {pais:$('#pais_usuario').val()}
        })
        .done(function(data)
        {
            if( data.result )
            {
                $.each( data.records, function( index,item )
                {
                    if(item.BLAND!='000'){
                        if(modal == 1){
                            deud_regio.append('<option class="provincias" value="'+item.BLAND+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                            regio.append('<option class="provincias" value="'+item.BLAND+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                        }
                        if(modal == 2)
                            deud_regio.append('<option class="provincias" value="'+item.BLAND+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                        if(modal == 3)
                            regio.append('<option class="provincias" value="'+item.BLAND+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                    }   
                });
            }
            else
                toastr['error'](data.message, 'Error');
        }).fail(function(err){
        }).always( function(){
        });

        $('#loader').fadeOut();
    }

    function cantones( e ){
        $('#loader').show();

        pais = $('#pais_usuario').val();
        provincia = $(this).val();
        tipoIndicador = $(this).attr('id').split('_')[0];

        if( $(this).val() && $('#pais_usuario').val()=='CR' ){

            if( tipoIndicador == 'DEUD'){
                
                indicador = $(this).attr('id').split('_')[2];
                $('#DEUD_COUNC'+'_'+indicador).removeAttr('readonly');
                selector = $('#DEUD_COUNC'+'_'+indicador);

            }
            if( tipoIndicador == 'REGIO'){
                
                indicador = $(this).attr('id').split('_')[1];
                $('#COUNC'+'_'+indicador).removeAttr('readonly');
                selector = $('#COUNC'+'_'+indicador);
            }
            
            $.ajax(
            {
                type:       'GET',
                url:        'ws/gac/cantones',
                dataType:   'json',
                data:        {pais: pais, provincia:provincia}
            })
            .done(function(data)
            {
                if( data.result )
                {
                    $('.cantones'+'_'+indicador).remove();

                    $.each( data.records, function( index,item )
                    {
                        if(item.COUNC!='000'){
                            selector.append('<option class="cantones" value="'+item.COUNC+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                        }
                    });
                }
                else
                    toastr['error'](data.message, 'Error');
                    
            }).fail(function(err){
                console.log( err );
            }).always( function(){
                $('#loader').fadeOut();
            });
        }
        else{
            if( $(this).val() && $('#pais_usuario').val()!='CR' ){

                if( tipoIndicador == 'DEUD'){
                    indicador = $(this).attr('id').split('_')[2];
                    $('#DEUD_CITYC'+'_'+indicador).removeAttr('readonly');
                    selector = $('#DEUD_CITYC'+'_'+indicador);

                }
                if( tipoIndicador == 'REGIO'){
                    indicador = $(this).attr('id').split('_')[1];
                    $('#CITYC'+'_'+indicador).removeAttr('readonly');
                    selector = $('#CITYC'+'_'+indicador);
                }

                $.ajax(
                {
                    type:       'GET',
                    url:        'ws/gac/distritos',
                    dataType:   'json',
                    data:       {pais:pais, provincia:provincia}
                })
                .done(function(data)
                {
                    if( data.result )
                    {
                        $('.distritos'+'_'+indicador).remove();

                        $.each( data.records, function( index,item )
                        {
                            if(item.COUNC!='0000'){
                                selector.append('<option class="cantones" value="'+item.CITYC+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                            }
                        });
                    }
                    else
                        toastr['error'](data.message, 'Error');
                }).fail(function(err){
                    console.log( err );
                    
                }).always( function(){
                    $('#loader').fadeOut();
                });
            }
        }
    };

    function distritos( e ){

        e.preventDefault();
        
        $('#loader').show();

        tipoIndicador = $(this).attr('id').split('_')[0];
        canton      = $(this).val()
        pais        = $('#pais_usuario').val()
        

        if( $(this).val() ){

                if( tipoIndicador == 'DEUD'){
                
                    indicador = $(this).attr('id').split('_')[2];
                    provincia   = $('#DEUD_REGIO'+'_'+indicador).val();
                    selector = $('#DEUD_CITYC'+'_'+indicador);

                    $('#DEUD_CITYC'+'_'+indicador).removeAttr('readonly');
                }
                if( tipoIndicador == 'COUNC'){
                    
                    indicador = $(this).attr('id').split('_')[1];
                    provincia   = $('#REGIO'+'_'+indicador).val();
                    selector = $('#CITYC'+'_'+indicador);

                    $('#CITYC'+'_'+indicador).removeAttr('readonly');
                }

                $.ajax(
                {
                    type:       'GET',
                    url:        'ws/gac/distritos',
                    dataType:   'json',
                    data:       {canton:canton, pais:pais, provincia:provincia}
                })
                .done(function(data)
                {
                    if( data.result )
                    {
                        $('.distritos'+'_'+indicador).remove();

                        $.each( data.records, function( index,item )
                        {
                            if(item.COUNC!='0000')
                                selector.append('<option class="distritos" value="'+item.CITYC+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                        });
                        $('#loader').fadeOut();
                    }
                    else{
                        toastr['error'](data.message, 'Error');
                    }
                }).fail(function(err){
                    console.log( err );
                }).always( function(){
                    $('#loader').fadeOut();
                });

        }else
            $('#loader').fadeOut();
    };

    function valornulo( valor, tipo ){
        if( tipo=='1' ){
            if(valor == '0' || valor == '' || valor == ' ' /*|| valor == 'Undefined'*/)
                return '';
            else
                return ', '+valor;
        }
        else{
            if(valor == '0' || valor == '' /*|| valor == 'Undefined'*/)
                return '';
            else
                return valor;
        }
    }

    function frecuenciavisitas( valor ){
        switch( valor ){
            case 'S':       return 'Semanal';                   break;
            case 'SP':      return 'Semanas Pares';             break;
            case 'SI':      return 'Semanas Impares';           break;
            case 'M1':      return 'Mensual Semana 1';          break;
            case 'M2':      return 'Mensual Semana 2';          break;
            case 'M3':      return 'Mensual Semana 3';          break;
            case 'M4':      return 'Mensual Semana 4';          break;
            default:        return 'Sin asignar';               break;
        }

    };

    function agregarCanal(){

        var indicador = $(this).attr('id').split('-')[3];

        var VTWEG       = $("#VTWEG_"+indicador).val();
        var DESCRIPCION = $("#VTWEG_"+indicador+" option:selected").text();
        var filaOculta  = false;

        if(VTWEG > 0){
            $("#tabla_canales_"+indicador+" tbody > tr").each( function(){
                
                if($(this).data('vtweg') == VTWEG){
                    $(this).show();
                    $(this).find('input').removeAttr('disabled');
                    $(this).find('input').val('0');
                    $(this).find('a').removeAttr('disabled');
                    filaOculta = true;
                }

            });

            if( filaOculta == false){
                var filacanal   = "<tr class='fila nuevo' data-vtweg='"+VTWEG+"'>"+
                                    "<td class='vtext' style='width: 350px; text-transform:capitalize;'>"+DESCRIPCION+"</td>"+
                                    "<td><input type='number' class='form-control canalcantidad-"+indicador+"'  min='0' class='form-control' style='width: 150px;' autofocus value='0'/></td>"+
                                    "<td><a class='btn-eliminarcanal-"+indicador+" btn btn-danger btn-xs' style='margin-top: 7px;'><i class='fa fa-times-circle'></i></a></td>"+
                                "</tr>";

                $("#tabla_canales_"+indicador+" tbody").append(filacanal);
            }

            $("#VTWEG_"+indicador+" option:selected").hide();
            $('#VTWEG_'+indicador+' option[value=""]').attr("selected", "selected");

            $("input.canalcantidad-"+indicador).keyup(inputCero);
            $("input.canalcantidad-"+indicador).keyup(eventoSumar);
        }
        else
            toastr['error']('No se ha seleccionado el canal', 'Error');
    }

    function eliminarCanal(){

        var clase = $(this).attr('class').split(' ')[0];
        var indicador = clase.split('-')[2];
        var canaleliminar = $(this).parent().parent();
        var VTWEG = canaleliminar.data('vtweg');

        canaleliminar.remove();

        $("#VTWEG_"+indicador).find("option").each( function(){

            if($(this).val() == VTWEG)
                $(this).show();

        });       

        sumaCanales(indicador);
    }

    function infoCredito(){
        
        var tipo_negocio = $(this).val();
        var indicador = $(this).attr('id').split('_')[1];

        $("#tabla_canales_"+indicador+" tbody").find(".fila").remove();
        $("#VTWEG_"+indicador).find(".canales").show();


        if( tipo_negocio > 0 ){
            $.ajax({
                type:       'GET',
                url:        'ws/gac/infomontocredito',
                dataType:   'json',
                data:       {tipo_negocio:tipo_negocio}
            })
            .done(function(data){

                if(data.result){
                    var options = $("#VTWEG_"+indicador).find("option");

                    $.each( data.records.TA_MONTOS.item, function( index,item ){

                        if(indicador == 'C' || indicador == 'G'){
                            options.each( function(){
                                if($(this).val() == item.VTWEG){
                                    $(this).hide();
                                }
                            });
                        }

                        var canales = "<tr class='fila' data-vtweg='"+item.VTWEG+"'>"+
                                            "<td class='vtext' style='width: 350px;'>"+item.DESCRIPCION+"</td>"+
                                            "<td><input type='number' class='form-control canalcantidad-"+indicador+"' min='0' style='width: 150px;' value='"+item.MONTO+"' disabled='true'/></td>"+
                                            "<td><a class='btn-eliminarcanal-"+indicador+" btn btn-danger btn-xs' style='margin-top: 7px;' disabled='true'><i class='fa fa-times-circle'></i></a></td>"+
                                        "</tr>";

                        $("#tabla_canales_"+indicador+" tbody").append(canales);

                    });

                    $("input.canalcantidad-"+indicador).keyup(inputCero);
                    sumaCanales(indicador);
                }
                else
                    toastr['error'](data.message, 'Error');
            })
            .fail(function(err){
                console.log( err );
            })
            .always( function(){
            });
        }
    }

    function formalizacionCredito(){

        var indicador = $(this).attr('id').split('_')[2];

        if($(this).is(':checked')){

            if(indicador == 'C'){

                toastr['warning']('Se requiere adjuntar las fotografías de personería (Física o Jurídica) y representante legal, para la formailización de crédito', 'Info');

                if($('#STKZN_I').val() == ''){
                    $('#FOTO_STCD1_C1').removeAttr('disabled');
                    $('#FOTO_STCD1_C2').removeAttr('disabled');
                    $('#FOTO_PAAT1_C1').removeAttr('disabled');
                    $('#FOTO_PAAT1_C2').removeAttr('disabled');
                }
                else{
                    $('#FOTO_PAAT1_C1').removeAttr('disabled');
                    $('#FOTO_PAAT1_C2').removeAttr('disabled');
                }
            }

            $('#VTWEG_'+indicador).removeAttr('disabled');
            $("#VTWEG_"+indicador+" option").show();
            $('#btn-agregar-canal-'+indicador).removeAttr('disabled');
            $('#tabla_canales_'+indicador).find('.fila').hide();
            $("#tabla_canales_"+indicador+" tfoot > tr").find(".total").text('0');

        }
        else{
            $('#VTWEG_'+indicador).attr('disabled', true);
            $('#btn-agregar-canal-'+indicador).attr('disabled',true);
            $('#tabla_canales_'+indicador).find('.fila').show();
            $('#tabla_canales_'+indicador).find('.nuevo').remove();
            $('#tabla_canales_'+indicador+' td').find('input').attr('disabled',true);
            $('#tabla_canales_'+indicador+' td').find('a').attr('disabled',true);
            $("#tabla_canales_"+indicador+" tfoot > tr").find(".total").text('0');
        }
    }

    function eventoSumar(e){
        
        var clase = $(this).attr('class').split(' ')[1];
        var indicador = clase.split('-')[1];

        sumaCanales( indicador );
    }

    function sumaCanales( indicador ){

        var total = 0;

        $("#tabla_canales_"+indicador+" tbody > tr").each( function(){
            
            if($(this).is(":visible")){
                var cantidad = parseFloat($(this).find("input").val());

                total += cantidad;
            }
        }); 

        $("#tabla_canales_"+indicador+" tfoot").find("tr").remove();

        var filatotal  =   "<tr>"+
                                "<th style='width: 350px;'><strong>Total: </strong></th>"+
                                "<th class='total' style='width: 150px;'><input type='number' class='form-control' style='width: 150px;' value='"+total+"' disabled='true'/></div></th>"+
                            "</tr>";

        $("#tabla_canales_"+indicador+" tfoot").append(filatotal);
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

    function bloquearinputfoto(){

        var indicador = $(this).attr('id').split('_')[1];

        if($(this).val() == '0')
            $("#FOTO_EXENTO_"+indicador).removeAttr('disabled');
        else {
            $("#FOTO_EXENTO_" + indicador).attr('disabled', true);
            $("#FOTO_EXENTO_" + indicador).val('');
        }
    }

    function habilitarFotoPatente() {

        var indicador = $(this).attr('id').split('_')[1];

        if($(this).val()!='')
            $('#FOTO_DKTXT_' + indicador).removeAttr('disabled');
        else{
            $('#FOTO_DKTXT_' + indicador).attr('disabled',true);
            $('#FOTO_DKTXT_' + indicador).val('');
        }
    }

    function cerrarModalCreado(){
        $('#modal-creado').modal('hide');  
        location.reload();
    }

    function limpiarValidacionesInput(){
        $('#form-nuevo')[0].reset();
        $("#form-nuevo").validate().resetForm();
        $('#form-agregar')[0].reset();
        $("#form-agregar").validate().resetForm();
        $('#form-agrego')[0].reset();
        $("#form-agrego").validate().resetForm();

        $("#form-nuevo #EX_ARCHIVOS_A").remove();
        $("#form-nuevo #STR_ARCHIVOS_A").remove();
        $("#form-agregar #EX_ARCHIVOS_B").remove();
        $("#form-agregar #STR_ARCHIVOS_B").remove();
        $("#form-agrego #EX_ARCHIVOS_C").remove();
        $("#form-agrego #STR_ARCHIVOS_C").remove();
        
        $('.form-control').removeClass('valid');
        $('.form-control').removeClass('error');
    }

    function mascaras() {
        $('.longitud').mask('-00.000000');
        $('.latitud').mask('09.999999');
    }

    function inputCero( e ){
        var valor = $(this).val();

        if(e.keyCode >= 49 && e.keyCode <= 57){
            if(parseInt(valor) >= 0){
                $(this).val(parseFloat(valor));
            } else {
                $(this).val(0);
            }
        }
        
        if($(this).val() == ''){
            $(this).val(0);
        }
    }

    $('#ampliado').on('change', function(){
        $('#AD_NAME1').removeAttr('readonly');
        $('#STCD1').removeAttr('readonly');
        $('FOTO_STCD1_A1').removeAttr('readonly');
        $('FOTO_STCD1_A2').removeAttr('readonly');
    });

    $('#ampliado_').on('change', function(){
        $('#AD_NAME1').removeAttr('readonly');
        $('#STCD1').removeAttr('readonly');
    });
});
