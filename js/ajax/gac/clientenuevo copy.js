jQuery( document ).ready( function( e )
{
    jQuery('#loader').fadeOut();
    var codigo='';
    var negocios=[];
    var rutas=[];
    var pais_codigo = '';
    var pais_nombre = '';
    jQuery('#IM_USUARIO1').val(localStorage.EMPID);
    jQuery('#IM_USUARIO2').val(localStorage.EMPID);
    jQuery('#IM_USUARIO3').val(localStorage.EMPID);

    jQuery('.input-date-picker').datepicker({
        format: 'yyyy-mm-dd',
        orientation: "bottom",
        daysOfWeekDisabled: "7",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true
    });
    window.tablaAreas = jQuery("#tb-busqueda").DataTable(
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
    jQuery('#btn-busqueda').on('click', busqueda);
    jQuery('#tb-busqueda').on('click','.btn-PDV-agregar', agregar);
    jQuery('#btn-agregar-PDV').on('click', agregarPDV);
    jQuery('#btn-crear-PDV').on('click', nuevoPDV);
    jQuery('#btn-Deudor-agregar').on('click')
    jQuery('#tb-busqueda').on('click','.btn-Deudor-agregar', agrego);
    jQuery('#btn-crear-DEUDOR').on('click', agregarDeudor);
    jQuery('#ampliado').on('change', cambio_persona);
    jQuery('#ampliado_').on('change', cambio_persona_);

    function cambio_persona(){
        if( jQuery('#ampliado').val() == '' ){
            jQuery('#contenido-juridico').show();
            jQuery('.P1').text(' Sociedad');
            jQuery('.P2').text('Cédula Jurídica'); 
            jQuery('.P3').text('Tipo doc. jurídico'); 
        }

        else{
            jQuery('#contenido-juridico').hide();
            jQuery('.P1').text(' Deudor');
            jQuery('.P2').text('Cédula jurídica');
            jQuery('.P3').text('Tipo doc. ID'); 
        }

    }

    function cambio_persona_(){
        console.log( jQuery('#ampliado_').val() );
        if( jQuery('#ampliado_').val() == '' ){
            jQuery('#contenido-juridico_').show();
            jQuery('.P1').text(' Sociedad');
            jQuery('.P2').text('Cédula Jurídica'); 
            jQuery('.P3').text('Tipo doc. jurídico'); 
        }
        else{
            jQuery('#contenido-juridico_').hide();
            jQuery('.P1').text(' Deudor');
            jQuery('.P2').text('Cédula jurídica');
            jQuery('.P3').text('Tipo doc. ID'); 

        }
    }

    jQuery('#liclicorsn').on('change', function(e){
        e.preventDefault();
        if( jQuery(this).val()=='S' ){
            jQuery('#liclicor').removeAttr('disabled');
        }else{
            jQuery('#liclicor').attr('disabled','true');
            jQuery('#liclicor').val('');
        }
    })

    jQuery('#liclicssnn').on('change', function(e){
        e.preventDefault();
        if( jQuery(this).val()=='S' ){
            jQuery('#liclicnum').removeAttr('disabled');
        }else{
            jQuery('#liclicnum').attr('disabled','true');
            jQuery('#liclicnum').val('');
        }
    })

    jQuery.ajax({
        type:       'GET',
        url:        'ws/gac/buscar/sociedades?email='+localStorage.USUARIO,
        dataType:   'json',
    })
    .done(function(data){
        if( data.result ){
            jQuery('.DD').show();
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

            jQuery('#pais_usuario').val(pais_codigo);
            switch( pais_codigo )
            {
                case 'CR':
                    jQuery('.A').text('Cédula');
                    jQuery('.B').text('Provincia');
                    jQuery('.C').text('Tipo de Cédula');
                    jQuery('.D').text('Cantón');
                    jQuery('.E').text('Distrito');
                    jQuery('.F').text('Barrio');
                    // jQuery('#ZLATITUD').val('10');
                    // jQuery('#ZLONG').val('83-');
                break;

                case 'GT':
                    jQuery('.A').text('NIT');
                    jQuery('.B').text('Departamento');
                    jQuery('.C').text('Tipo de NIT');
                    jQuery('.DD').hide();
                    jQuery('.E').text('Municipio');
                    jQuery('.F').text('Zona');
                    // jQuery('#ZLATITUD').val('17');
                    // jQuery('#ZLONG').val('90-');
                break;

                case 'SV':
                    jQuery('.A').text('NIT');
                    jQuery('.B').text('Departamento');
                    jQuery('.C').text('Tipo de NIT');
                    jQuery('.DD').hide();
                    jQuery('.E').text('Municipio');
                    jQuery('.F').text('Zona');
                break;
            }
        }
        else
            toastr['error'](data.message, 'Error');
    }).fail(function(err){
        console.log('Pais no se detectó');
    });

    jQuery('#bus').on('change', function(e){
        if( jQuery('#bus').val()=='PDV' ){
            jQuery('#buscar').attr('placeholder','Nombre o código de PDV');
            jQuery('#buscar').removeAttr('type');
            jQuery('#buscar').attr('type','text');
        }else{
            jQuery('#buscar').attr('placeholder','Código del Deudor');
            jQuery('#buscar').removeAttr('type');
            jQuery('#buscar').attr('type','number');
        }
    });

    //Funciones
    function busqueda( e ){
        e.preventDefault();
        if( jQuery('#buscar').val() ){
            jQuery("#tb-busqueda").dataTable().fnClearTable();
            if( jQuery('#bus').val()=='Deudor' ){
                codigo = jQuery('#buscar').val();

                if( jQuery('#buscar').val())
                {
                    jQuery('#loader').show();
                    jQuery('.dat1').text('Código');
                    jQuery('.dat2').text('Tipo Id');
                    jQuery('.dat3').text('Nombre');
                    jQuery('.dat4').text('Tipo de Deudor');
                    jQuery('.dat5').text('Dirección');
                    jQuery('.dat6').text('Correo');
                    jQuery.ajax({
                        type:       'POST',
                        url:        'ws/gac/deudores/buscar',
                        data:       { 'buscar':jQuery('#buscar').val(), sociedad: localStorage.SOCIEDAD, email: localStorage.USUARIO, empid: localStorage.EMPID},
                        success: function( result )
                            {
                                if( result.result )
                                {
                                    jQuery.ajax({
                                        type:       'GET',
                                        url:        'ws/gac/codigos/consulta',
                                        dataType:   'json',
                                    })
                                    .done(function(data){

                                        jQuery.each( result.records.TA_INFO_DEUDOR.item, function( index,item ){
                                            jQuery.each( data.records.tipo_id, function( index,value ){

                                                if(value.id ==item.PAAT1){
                                                    var correo =item.AD_SMTPADR;
                                                    if(!item.AD_SMTPADR)
                                                        correo='Sin Asignar';

                                                    var tp='Persona Jurídica';
                                                    if( item.STKZN=='X' ){
                                                        tp='Persona Física';
                                                    }

                                                    jQuery('#tb-busqueda').dataTable().fnAddData([
                                                        item.KUNNR,
                                                        value.valor,
                                                        '<i style="text-transform:capitalize;">'+item.AD_NAME1.toLowerCase()+'</i>',
                                                        tp,
                                                        '<i style="text-transform:capitalize;">'+(item.DEUD_REGIO_DESC.toLowerCase()+', '+item.DEUD_LAND1_DESC.toLowerCase())+'</i>',
                                                        correo,
                                                        '<a data-placement="top" data-bus="Deudor" data-cedula="'+item.KUNNR+'" href="#modal-agregar" data-toggle="modal"  title="Agregar nuevo PDV a Deudor" class="toltip btn-PDV-agregar btn btn-success btn-xs" ><i class="fa fa-file-o"></i> PDV</a>',/*fa-plus*/
                                                    ]);
                                                }
                                            });

                                        });
                                        
                                        negocios=[];
                                        negocios = data.records.tipo_negocio;
                                        rutas=[];
                                        rutas = data.records.tipo_rutas;

                                        
                                        jQuery('#loader').fadeOut();
                                        toastr['success'](result.message, 'Éxito');

                                    }).fail(function(err){
                                        toastr['success'](result.message, 'Éxito');
                                        jQuery('#loader').fadeOut();
                                    });
                                }
                                else
                                {
                                    jQuery("#tb-busqueda").dataTable().fnClearTable();
                                    toastr['success'](result.message, 'Exito');
                                    jQuery('#loader').fadeOut();
                                }
                            },
                        error: function( result )
                            {
                                toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
                                jQuery('#loader').fadeOut();
                            }
                    });
                }
                else
                    toastr['error']('Se necesita el codigo o nombre del Deudor', 'Error');
            }else{
                jQuery('#loader').show();
                    jQuery('.dat1').text('Código');
                    jQuery('.dat2').text('Tipo de Negocio');
                    jQuery('.dat3').text('Nombre');
                    jQuery('.dat4').text('Patente');
                    jQuery('.dat5').text('Teléfono');
                    jQuery('.dat6').text('Dirección');
                jQuery.ajax({
                    type:       'POST',
                    url:        'ws/gac/pdvs/buscar',
                    data:       { 'buscar':jQuery('#buscar').val(), sociedad: localStorage.SOCIEDAD, email: localStorage.USUARIO, empid: localStorage.EMPID},
                    success: function( result )
                    {
                        if( result.result ){
                            jQuery.each( result.records.TA_INFO_PDV.item , function( index,value ){
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

                                jQuery('#tb-busqueda').dataTable().fnAddData([
                                    value.KUNNR,
                                    '<span style="text-transform:capitalize;">'+ value.BRSCH_DESC+'</span>',
                                    '<i style="text-transform:capitalize;">'+ value.NOMBRE_PDV+'</i>',
                                    patente,
                                    telefono,
                                    '<i style="text-transform:capitalize;">'+(value.REGIO_DESC.toLowerCase()+', '+value.LAND1_DESC.toLowerCase())+'</i>',
                                    '<a data-placement="top" data-bus="PDV" data-codigo="'+value.KUNNR+'" href="#modal-agrego" data-toggle="modal"  title="Agregar nuevo Deudor a PDV" class="toltip btn-Deudor-agregar btn btn-success btn-xs" ><i class="fa fa-file-o"></i> Deudor</a>',/*fa-plus*/
                                ]);
                            });

                            jQuery('#loader').fadeOut();
                            toastr['success'](result.message, 'Éxito');
                        }else{
                            jQuery('#loader').fadeOut();
                            toastr['success'](result.message, 'Éxito');
                        }

                    },
                    error: function( result )
                    {
                        toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
                        jQuery('#loader').fadeOut();
                    }
                });
            }
        }
        else{
            toastr['error']('No hay informacion que buscar '+jQuery('#buscar').val(), 'Error');
        }
            // jQuery('#loader').fadeOut();
    }

    function agregar ( e ){
        e.preventDefault();
        jQuery('.P1').text(' Sociedad');
        jQuery('.P2').text('Cédula Jurídica'); 
        jQuery('.P3').text('Tipo doc. jurídico');



        jQuery('#negocio').val('');
        jQuery('#ampliado').val('');
        jQuery('#patente').val('');
        jQuery('#licencia').val('');
        jQuery('.provincias').remove('');
        jQuery('.negocios').remove('');
        jQuery('#canton_pdv').val('');
        jQuery('#ciudad_pdv_').text(pais_nombre);
        jQuery('#LAND1').val(pais_codigo);
        jQuery('#barrio_pdv').val('');
        jQuery('#sena_pdv').val('');
        jQuery('#tel1_pdv').val('');
        jQuery('#tel2_pdv').val('');
        jQuery('#tel3_pdv').val('');
        jQuery('#tipon_pdv').val('');
        jQuery('#rutaa_pdv').val('');
        jQuery('#rutana_pdv').val('');
        jQuery('#zona_pdv').val('');
        jQuery('#frecuencia_pdv').val('');
        jQuery('#visita_pdv').val('');
        jQuery('#lunes').val('');
        jQuery('#rol_lunes').val('0');
        jQuery('#martes').val('');
        jQuery('#rol_martes').val('0');
        jQuery('#miercoles').val('');
        jQuery('#rol_miercoles').val('0');
        jQuery('#jueves').val('');
        jQuery('#rol_jueves').val('0');
        jQuery('#viernes').val('');
        jQuery('#rol_viernes').val('0');
        jQuery('#sabado').val('');
        jQuery('#rol_sabado').val('0');

        cedula = jQuery(this).data('cedula');
        jQuery('#loader').show();

        jQuery.ajax({
            type:       'POST',
            url:        'ws/gac/deudores/buscar',
            data:       { 'buscar':cedula, sociedad: localStorage.SOCIEDAD, email: localStorage.USUARIO, empid: localStorage.EMPID},
            success: function( result )
                {
                    var dataDeudor = result.records.TA_INFO_DEUDOR.item[0];
                        result.records=result.records.TA_INFO_DEUDOR.item;
                        jQuery('#KUNNR1').val(dataDeudor.KUNNR);
                        jQuery('#KUNNR2').text(dataDeudor.KUNNR);
                        // jQuery('#form-agregar').reset();
                        // jQuery('#form-nuevo').reset();
                        // jQuery('#form-agrego').reset();
                        jQuery('#DEUDOR').val(cedula);
                        jQuery('#STCD1').val(cedula);
                        jQuery('#PAAT1').val(dataDeudor.PAAT1);
                        jQuery('#STKZN').val(dataDeudor.STKZN);
                        jQuery('#AD_NAME1').val(dataDeudor.AD_NAME1);
                        jQuery('#DEUD_REGIO').val(dataDeudor.DEUD_REGIO);
                        jQuery('#DEUD_COUNC').val(dataDeudor.DEUD_COUNC);
                        jQuery('#DEUD_CITYC').val(dataDeudor.DEUD_CITYC);
                        jQuery('#DEUD_LAND1').val(dataDeudor.DEUD_LAND1);
                        jQuery('#DEUD_AD_STRSPP3').val(dataDeudor.DEUD_AD_STRSPP3);
                        jQuery('#DEUD_AD_NAME_CO').val(dataDeudor.DEUD_AD_NAME_CO);
                        jQuery('#CONT_TELEF1').val(dataDeudor.CONT_TELEF1);
                        jQuery('#CONT_TELEF2').val(dataDeudor.CONT_TELEF2);
                        jQuery('#CONT_TELEF3').val(dataDeudor.CONT_TELEF3);
                        jQuery('#AD_SMTPADR').val(dataDeudor.AD_SMTPADR);
                        //------------------------------------------------------------------------------------------fin
                        //datos del pdv

                        //------------------------------------------------------------------------------------------fin
                    // FIN DATOS PARA ENVIAR
                    dataDeudor.STKZN=='X'?tipo='Persona Física':tipo='Persona Jurídica';
                    jQuery('#tipo').text(tipo);
                    if( dataDeudor.STKZN ){
                        jQuery('#contenido-juridico-_').hide();
                        jQuery('.P1').text(' Deudor');
                        jQuery('.P2').text('Cédula jurídica');
                    }else{
                        jQuery('#contenido-juridico-_').show();
                        jQuery('.P1').text(' Sociedad');
                        jQuery('.P2').text('Cédula Jurídica');
                        jQuery('#AD_NAMEFIR').text(dataDeudor.AD_NAMEFIR );
                        jQuery('#AD_NAMEFIR_1').text(dataDeudor.AD_NAMEFIR );
                        jQuery('#AD_NAME2_P').text(dataDeudor.AD_NAME2_P );
                        jQuery('#AD_NAME2_P_1').text(dataDeudor.AD_NAME2_P );
                    }

                    jQuery('#codigo').text(' '+valornulo(dataDeudor.STCD1)+' ');
                    jQuery('#deudor').text(' '+dataDeudor.AD_NAME1.toLowerCase());
                    jQuery('#provincia').text(' '+dataDeudor.DEUD_REGIO_DESC.toLowerCase());
                    jQuery('#canton').text(' '+valornulo(dataDeudor.DEUD_COUNC_DESC.toLowerCase()));
                    jQuery('#distrito').text(' '+valornulo(dataDeudor.DEUD_CITYC_DESC.toLowerCase()));
                    jQuery('#ciudad').text(' '+dataDeudor.DEUD_LAND1_DESC.toLowerCase());
                    jQuery('#senas').text(' '+valornulo(dataDeudor.DEUD_AD_NAME_CO.toLowerCase()));
                    jQuery('#barrio').text(' '+valornulo(dataDeudor.DEUD_AD_STRSPP3.toLowerCase()));
                    jQuery('#telefono1').text(' '+valornulo(dataDeudor.CONT_TELEF1));
                    jQuery('#telefono2').text(' '+valornulo(dataDeudor.CONT_TELEF2));
                    jQuery('#telefono3').text(' '+valornulo(dataDeudor.CONT_TELEF3));
                    jQuery('#correo').text(' '+valornulo(dataDeudor.AD_SMTPADR.toUpperCase()));
                    jQuery('#loader').fadeOut();
                    //Agregando valores de Direcciones
                    jQuery('.ruta').remove();
                    jQuery.each( rutas, function( index,item )
                    {
                        jQuery('#ruta_pdv').append('<option class="ruta" value="'+item.id+'" style="text-transform:capitalize;">'+item.id+' - '+item.valor.toLowerCase()+'</option>');
                    });
                    var pais=jQuery('#pais_usuario').val();
                    jQuery.ajax(
                    {
                        type:       'GET',
                        url:        'ws/gac/provincia?pais='+pais,
                        dataType:   'json',
                    })
                    .done(function(data)
                    {
                        if( data.result )
                        {
                            jQuery.each( data.records, function( index,item )
                            {
                                if(item.BLAND!='000')
                                    jQuery('#provincia_pdv').append('<option class="provincias" value="'+item.BLAND+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                            });
                        }
                        else
                            toastr['error'](data.message, 'Error');
                    }).fail(function(err){
                        console.log( err );
                    }).always( function(){
                        console.log('Completo');
                    });
                    //Agregando el tipo
                    jQuery.each( negocios, function( index,item ){
                        jQuery('#BRSCH').append('<option class="negocios" value="'+item.id+'" style="text-transform:capitalize;">'+item.valor.toLowerCase()+'</option>');
                    });
                }
        });
    }

    function agrego(e){
        e.preventDefault();
        jQuery('.P1').text('Sociedad');
        jQuery('.P2').text('Cédula Jurídica'); 
        jQuery('.P3').text('Tipo doc. jurídico'); 
        jQuery('.limpiar').val('');
        jQuery('#loader').show();
        jQuery('#DEUD_LAND1_B_CODIGO').val( pais_codigo );
        var codigo = jQuery(this).data('codigo');
        jQuery('#provincias_B').remove();

        jQuery.ajax({
            type:       'GET',
            url:        'ws/gac/pdvs/buscar',
            dataType:   'json',
            data:       {buscar:codigo, sociedad: localStorage.SOCIEDAD, email: localStorage.USUARIO, empid: localStorage.EMPID},
        })
        .done(function(data){
            jQuery('#form-agregar')[0].reset();
            jQuery('#form-nuevo')[0].reset();
            jQuery('#form-agrego')[0].reset();
            jQuery('#KUNNRPDV1').val(data.records.TA_INFO_PDV.item[0].KUNNR);
            jQuery('#KUNNRPDV2').text(data.records.TA_INFO_PDV.item[0].KUNNR);
            jQuery('#NOMBRE_PDV_B').text(valornulo(data.records.TA_INFO_PDV.item[0].NOMBRE_PDV.toLowerCase(),'0'));
            jQuery('#DKTXT_B').text(data.records.TA_INFO_PDV.item[0].DKTXT?data.records.TA_INFO_PDV.item[0].DKTXT:'Sin Asignar');
            jQuery('#BRSCH_B').text(valornulo(data.records.TA_INFO_PDV.item[0].BRSCH_DESC.toLowerCase(),'0'));
            jQuery('#REGIO_B').text(valornulo(data.records.TA_INFO_PDV.item[0].REGIO_DESC.toLowerCase(),'0'));
            jQuery('#COUNC_B').text(valornulo(data.records.TA_INFO_PDV.item[0].COUNC_DESC.toLowerCase(),'0'));
            jQuery('#CITYC_B').text(valornulo(data.records.TA_INFO_PDV.item[0].CITYC_DESC.toLowerCase(),'0'));
            jQuery('#LAND1_B').text(valornulo(data.records.TA_INFO_PDV.item[0].LAND1_DESC.toLowerCase(),'0'));
            jQuery('#AD_STRSPP3_B').text(valornulo(data.records.TA_INFO_PDV.item[0].AD_STRSPP3.toLowerCase(),'0'));
            jQuery('#AD_NAME_CO_B').text(valornulo(data.records.TA_INFO_PDV.item[0].AD_NAME_CO.toLowerCase(),'0'));
            jQuery('#TELF1_B').text(valornulo(data.records.TA_INFO_PDV.item[0].TELF1,'0'));
            jQuery('#TELF2_B').text(valornulo(data.records.TA_INFO_PDV.item[0].TELF2,'0'));
            jQuery('#TELFX_B').text(valornulo(data.records.TA_INFO_PDV.item[0].TELFX,'0'));
            jQuery('#FREC_VISITA_B').text(valornulo(data.records.TA_INFO_PDV.item[0].FREC_VISITA,'0'));
            jQuery('#IND_TELEVENTA_B').text(' '+data.records.TA_INFO_PDV.item[0].IND_TELEVENTA=='S'?'Si':'No');
            jQuery('#IND_TELEVENTA_G').text(data.records.TA_INFO_PDV.item[0].IND_TELEVENTA);


            jQuery('#ZLONG_B').text(valornulo(data.records.TA_INFO_PDV.item[0].ZLONG,'0'));
            jQuery('#ZLONG_').text(valornulo(data.records.TA_INFO_PDV.item[0].ZLONG,'0'));
            jQuery('#ZLATITUD_B').text(valornulo(data.records.TA_INFO_PDV.item[0].ZLATITUD,'0'));
            jQuery('#ZLATITUD_').text(valornulo(data.records.TA_INFO_PDV.item[0].ZLATITUD,'0'));


            jQuery('#FREC_VISITA_G').text(' '+frecuenciavisitas( data.records.TA_INFO_PDV.item[0].FREC_VISITA ));
            jQuery('#FREC_VISITA_G').text(data.records.TA_INFO_PDV.item[0].FREC_VISITA);
            jQuery('#BZIRK_G').text(data.records.TA_INFO_PDV.item[0].BZIRK);
            if( data.records.TA_INFO_PDV.item[0].BZIRK ){
                jQuery.ajax({
                        type:       'GET',
                        url:        'ws/gac/codigos/consulta',
                        dataType:   'json',
                    })
                    .done(function(data){
                        jQuery.each( data.records.tipo_rutas, function( index,value ){
                            if(value.id == data.records.TA_INFO_PDV.item[0].BZIRK )
                                jQuery('#BZIRK_B').text(' '+value.valor);
                        });
                    }).fail(function(err){
                        toastr['error'](err.message, 'Error');
                    });
            }else{
                jQuery('#BZIRK_B').text('Sin Asignar');
            }


            jQuery('#NOMBRE_PDV_G').val(data.records.TA_INFO_PDV.item[0].NOMBRE_PDV);
            jQuery('#DKTXT_G').val(data.records.TA_INFO_PDV.item[0].DKTXT);
            jQuery('#BRSCH_G').val(data.records.TA_INFO_PDV.item[0].BRSCH);
            jQuery('#REGIO_G').val(data.records.TA_INFO_PDV.item[0].REGIO);
            jQuery('#COUNC_G').val(data.records.TA_INFO_PDV.item[0].COUNC);
            jQuery('#CITYC_G').val(data.records.TA_INFO_PDV.item[0].CITYC);
            jQuery('#LAND1_G').val(data.records.TA_INFO_PDV.item[0].LAND1);
            jQuery('#AD_STRSPP3_G').val(data.records.TA_INFO_PDV.item[0].AD_STRSPP3);
            jQuery('#AD_NAME_CO_G').val(data.records.TA_INFO_PDV.item[0].AD_NAME_CO);
            jQuery('#TELF1_G').val(data.records.TA_INFO_PDV.item[0].TELF1);
            jQuery('#TELF2_G').val(data.records.TA_INFO_PDV.item[0].TELF2);
            jQuery('#TELFX_G').val(data.records.TA_INFO_PDV.item[0].TELFX);
            jQuery('#FREC_VISITA_G').val(data.records.TA_INFO_PDV.item[0].FREC_VISITA);
            jQuery('#ZLATITUD').val(data.records.TA_INFO_PDV.item[0].ZLATITUD);
            jQuery('#ZLONG').val(data.records.TA_INFO_PDV.item[0].ZLONG);



            if( data.records.TA_INFO_PDV.item[0].ORDEN_LUNES=='1' ){
                jQuery('#ORDEN_LUNES_B').attr('checked','checked');
                jQuery('#rol_lunes_B').val('1');
            }else{
                jQuery('#ORDEN_LUNES_B').removeAttr('checked');
                jQuery('#rol_lunes_B').val('0');
            }

            if( data.records.TA_INFO_PDV.item[0].ORDEN_MARTES=='1' ){
                jQuery('#ORDEN_MARTES_B').attr('checked','checked');
                jQuery('#rol_martes_B').val('1');
            }else{
                jQuery('#ORDEN_MARTES_B').removeAttr('checked');
                jQuery('#rol_martes_B').val('0');
            }

            if( data.records.TA_INFO_PDV.item[0].ORDEN_MIERCOLES=='1' ){
                jQuery('#ORDEN_MIERCOLES_B').attr('checked','checked');
                jQuery('#rol_miercoles_B').val('1');
            }else{
                jQuery('#ORDEN_MIERCOLES_B').removeAttr('checked');
                jQuery('#rol_miercoles_B').val('0');
            }

            if( data.records.TA_INFO_PDV.item[0].ORDEN_JUEVES=='1' ){
                jQuery('#ORDEN_JUEVES_B').attr('checked','checked');
                jQuery('#rol_jueves_B').val('1');
            }else{
                jQuery('#ROL_JUEVES_B').removeAttr('checked');
                jQuery('#rol_jueves_B').val('');
            }

            if( data.records.TA_INFO_PDV.item[0].ORDEN_VIERNES=='1' ){
                jQuery('#ORDEN_VIERNES_B').attr('checked','checked');
                jQuery('#rol_viernes_B').val('1');
            }else{
                jQuery('#ROL_VIERNES_B').removeAttr('checked');
                jQuery('#rol_viernes_B').val('0');
            }

            if( data.records.TA_INFO_PDV.item[0].ORDEN_SABADO=='1' ){
                jQuery('#ORDEN_SABADO_B').attr('checked','checked');
                jQuery('#rol_sabado_B').val('1');
            }else{
                jQuery('#ORDEN_SABADO_B').removeAttr('checked');
                jQuery('#rol_sabado_B').val('0');
            }
        });

        jQuery.ajax({
            type:       'GET',
            url:        'ws/gac/codigos/consulta',
            dataType:   'json',
        })
        .done(function(data){
            jQuery('.tipos_id_B').remove();
            jQuery.each( data.records.tipo_id, function( index,item )
            {
                jQuery('#PAAT1_B').append('<option class="tipos_id_B" value="'+item.id+'" style="text-transform:capitalize;">'+item.valor.toLowerCase()+'</option>');
            });
        }).fail(function(err){
            console.log(err.messages);
        });

        jQuery('#DEUD_LAND1_B').text(pais_nombre);
        //Agregando valores de Direcciones
        var pais=jQuery('#pais_usuario').val();
        jQuery.ajax(
        {
            type:       'GET',
            url:        'ws/gac/provincia?pais='+pais,
            dataType:   'json',
        })
        .done(function(data)
        {
            if( data.result )
            {
                jQuery.each( data.records, function( index,item )
                {
                    if(item.BLAND!='000')
                        jQuery('#DEUD_REGIO_B').append('<option class="provincias_B" value="'+item.BLAND+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                });
                jQuery('#loader').fadeOut();
            }
            else{
                toastr['error'](data.message, 'Error');
                jQuery('#loader').fadeOut();
            }
        }).fail(function(err){
            console.log( err );
            jQuery('#loader').fadeOut();
        }).always( function(){
            console.log('Completo');
        });
    }
    //cambios de lugares
    jQuery('#provincia_pdv').on('change', function(e){
        e.preventDefault();
        if( jQuery('#provincia_pdv').val() && jQuery('#pais_usuario').val()=='CR' ){
            jQuery('#loader').show();
            jQuery('.cantones').remove('');
            jQuery('.distritos').remove('');
            jQuery('#canton_pdv').removeAttr( 'disabled','true');
            jQuery.ajax(
            {
                type:       'GET',
                url:        'ws/gac/cantones?pais='+jQuery('#pais_usuario').val()+'&provincia='+jQuery('#provincia_pdv').val(),
                dataType:   'json',
            })
            .done(function(data)
            {
                if( data.result )
                {
                    jQuery.each( data.records, function( index,item )
                    {
                        if(item.COUNC!='000')
                            jQuery('#canton_pdv').append('<option class="cantones" value="'+item.COUNC+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                    });
                    jQuery('#loader').fadeOut();
                }
                else{
                    toastr['error'](data.message, 'Error');
                    jQuery('#loader').fadeOut();
                }

            }).fail(function(err){
                console.log( err );
                jQuery('#loader').fadeOut();
            }).always( function(){

            });
            jQuery('#distrito_pdv').attr( 'disabled','true');
        }
        else{
            jQuery('#loader').show();
            if( jQuery('#provincia_pdv').val() && jQuery('#pais_usuario').val()!='CR' ){
                jQuery('.distritos').remove('');
                jQuery('#distrito_pdv').removeAttr( 'disabled','true');
                jQuery.ajax(
                {
                    type:       'GET',
                    url:        'ws/gac/distritos?canton='+''+'&pais='+jQuery('#pais_usuario').val()+'&provincia='+jQuery('#provincia_pdv').val(),
                    dataType:   'json',
                })
                .done(function(data)
                {
                    if( data.result )
                    {
                        jQuery.each( data.records, function( index,item )
                        {
                            if(item.COUNC!='0000')
                                jQuery('#distrito_pdv').append('<option class="distritos" value="'+item.CITYC+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                        });
                        jQuery('#loader').fadeOut();
                    }
                    else{
                        toastr['error'](data.message, 'Error');
                        jQuery('#loader').fadeOut();
                    }
                }).fail(function(err){
                    console.log( err );
                }).always( function(){
                });
            }
            else{
                jQuery('#distrito_pdv').attr( 'disabled','true');
                jQuery('#canton_pdv').attr( 'disabled','true');
                jQuery('#loader').fadeOut();
            }
        }
    });

    jQuery('#canton_pdv').on('change', function(e){
        e.preventDefault();
        console.log( jQuery('#canton_pdv').val()+'&pais='+jQuery('#pais_usuario').val()+'&provincia='+jQuery('#provincia_pdv').val() );
        jQuery('#loader').show();
        jQuery('.distritos').remove('');

        if( jQuery('#canton_pdv').val() ){
                jQuery('#distrito_pdv').removeAttr( 'disabled','true');
                jQuery.ajax(
                {
                    type:       'GET',
                    url:        'ws/gac/distritos?canton='+jQuery('#canton_pdv').val()+'&pais='+jQuery('#pais_usuario').val()+'&provincia='+jQuery('#provincia_pdv').val(),
                    dataType:   'json',
                })
                .done(function(data)
                {
                    if( data.result )
                    {
                        jQuery.each( data.records, function( index,item )
                        {
                            if(item.COUNC!='0000')
                                jQuery('#distrito_pdv').append('<option class="distritos" value="'+item.CITYC+'" style="text-transform:capitalize;"> '+item.BEZEI.toLowerCase()+'</option>');
                        });
                        jQuery('#loader').fadeOut();
                    }
                    else{
                        toastr['error'](data.message, 'Error');
                        jQuery('#loader').fadeOut();
                    }
                }).fail(function(err){
                    console.log( err );
                    jQuery('#loader').fadeOut();
                }).always( function(){
                });

        }else{
            jQuery('#loader').fadeOut();
        }
    });

    jQuery('#DEUD_REGIO_B').on('change', function(e){
        e.preventDefault();
        if( jQuery('#DEUD_REGIO_B').val() && jQuery('#pais_usuario').val()=='CR' ){
            jQuery('#loader').show();
            jQuery('.cantones_B').remove('');
            jQuery('.distritos_B').remove('');
            jQuery('#DEUD_COUNC_B').removeAttr( 'disabled','true');
            jQuery.ajax(
            {
                type:       'GET',
                url:        'ws/gac/cantones?pais='+jQuery('#pais_usuario').val()+'&provincia='+jQuery('#DEUD_REGIO_B').val(),
                dataType:   'json',
            })
            .done(function(data)
            {
                if( data.result )
                {
                    jQuery.each( data.records, function( index,item )
                    {
                        if(item.COUNC!='000')
                            jQuery('#DEUD_COUNC_B').append('<option class="cantones_B" value="'+item.COUNC+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                    });
                    jQuery('#loader').fadeOut();
                }
                else{
                    toastr['error'](data.message, 'Error');
                    jQuery('#loader').fadeOut();
                }
            }).fail(function(err){
                console.log( err );
                jQuery('#loader').fadeOut();
            }).always( function(){
            });
            jQuery('#DEUD_CITYC_B').attr( 'disabled','true');
        }
        else{
            jQuery('#loader').show();
            if( jQuery('#DEUD_REGIO_B').val() && jQuery('#pais_usuario').val()!='CR' ){
                jQuery('.distritos_B').remove('');
                jQuery('#DEUD_CITYC_B').removeAttr( 'disabled','true');
                jQuery.ajax(
                {
                    type:       'GET',
                    url:        'ws/gac/distritos?canton='+''+'&pais='+jQuery('#pais_usuario').val()+'&provincia='+jQuery('#DEUD_REGIO_B').val(),
                    dataType:   'json',
                })
                .done(function(data)
                {
                    if( data.result )
                    {
                        jQuery.each( data.records, function( index,item )
                        {
                            if(item.COUNC!='0000')
                                jQuery('#DEUD_CITYC_B').append('<option class="distritos_B" value="'+item.CITYC+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                        });
                        jQuery('#loader').fadeOut();
                    }
                    else{
                        toastr['error'](data.message, 'Error');
                        jQuery('#loader').fadeOut();
                    }
                }).fail(function(err){
                    console.log( err );
                    jQuery('#loader').fadeOut();
                }).always( function(){
                });
            }
            else{
                jQuery('#DEUD_CITYC_B').attr( 'disabled','true');
                jQuery('#DEUD_COUNC_B').attr( 'disabled','true');
                jQuery('#loader').fadeOut();
            }
        }
    });

    jQuery('#DEUD_COUNC_B').on('change', function(e){
        e.preventDefault();
        jQuery('.distritos_B').remove('');
        jQuery('#loader').show();
        if( jQuery('#DEUD_COUNC_B').val() ){
                jQuery('#DEUD_CITYC_B').removeAttr( 'disabled','true');
                jQuery.ajax(
                {
                    type:       'GET',
                    url:        'ws/gac/distritos?canton='+jQuery('#DEUD_COUNC_B').val()+'&pais='+jQuery('#pais_usuario').val()+'&provincia='+jQuery('#provincia_pdv').val(),
                    dataType:   'json',
                })
                .done(function(data)
                {
                    if( data.result )
                    {
                        jQuery.each( data.records, function( index,item )
                        {
                            if(item.COUNC!='0000')
                                jQuery('#DEUD_CITYC_B').append('<option class="distritos_B" value="'+item.CITYC+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                        });
                        jQuery('#loader').fadeOut();
                    }
                    else{
                        toastr['error'](data.message, 'Error');
                    }
                }).fail(function(err){
                    console.log( err );
                    jQuery('#loader').fadeOut();
                }).always( function(){
                });

        }else
            jQuery('#loader').fadeOut();
    });

    jQuery('#lunes').on('change',function(e){   // jQuery('#lunes').prop('checked')?console.log('Si lunes'):console.log('No lunes');
        jQuery('#rol_lunes').val('');
        if( jQuery('#lunes').prop('checked') )
            jQuery('#rol_lunes').val('1');
        else
            jQuery('#rol_lunes').val('0');
    });

    jQuery('#martes').on('change',function(e){  // jQuery('#martes').prop('checked')?console.log('Si martes'):console.log('No martes');
        jQuery('#rol_martes').val('');
        if( jQuery('#martes').prop('checked') )
            jQuery('#rol_martes').val('1');
        else
            jQuery('#rol_martes').val('0');
    });

    jQuery('#miercoles').on('change',function(e){   // jQuery('#miercoles').prop('checked')?console.log('Si miercoles'):console.log('No miercoles');
        jQuery('#rol_miercoles').val('');
        if( jQuery('#miercoles').prop('checked') )
            jQuery('#rol_miercoles').val('1');
        else
            jQuery('#rol_miercoles').val('0');
    });

    jQuery('#jueves').on('change',function(e){  // jQuery('#jueves').prop('checked')?console.log('Si jueves'):console.log('No jueves');
        jQuery('#rol_jueves').val('');
        if( jQuery('#jueves').prop('checked') )
            jQuery('#rol_jueves').val('1');
        else
            jQuery('#rol_jueves').val('0');
    });

    jQuery('#viernes').on('change',function(e){ // jQuery('#viernes').prop('checked')?console.log('Si viernes'):console.log('No viernes');
        jQuery('#rol_viernes').val('');
        if( jQuery('#viernes').prop('checked') )
            jQuery('#rol_viernes').val('1');
        else
            jQuery('#rol_viernes').val('0');
    });

    jQuery('#sabado').on('change',function(e){  // jQuery('#sabado').prop('checked')?console.log('Si sabado'):console.log('No sabado');
        jQuery('#rol_sabado').val('');
        if( jQuery('#sabado').prop('checked') )
            jQuery('#rol_sabado').val('1');
        else
            jQuery('#rol_sabado').val('0');
    });

    jQuery('#lunes_').on('change',function(e){
        jQuery('#rol_lunes_').val('');
        if( jQuery('#lunes_').prop('checked') )
            jQuery('#rol_lunes_').val('1');
        else
            jQuery('#rol_lunes_').val('0');
    });

    jQuery('#martes_').on('click',function(e){
        jQuery('#rol_martes_').val('');
        if( jQuery('#martes_').prop('checked') )
            jQuery('#rol_martes_').val('1');
        else
            jQuery('#rol_martes_').val('0');
    });

    jQuery('#miercoles_').on('click',function(e){
        jQuery('#rol_miercoles_').val('');
        if( jQuery('#miercoles_').prop('checked') )
            jQuery('#rol_miercoles_').val('1');
        else
            jQuery('#rol_miercoles_').val('0');
    });

    jQuery('#jueves_').on('click',function(e){
        jQuery('#rol_jueves_').val('');
        if( jQuery('#jueves_').prop('checked') )
            jQuery('#rol_jueves_').val('1');
        else
            jQuery('#rol_jueves_').val('0');
    });

    jQuery('#viernes_').on('click',function(e){
        jQuery('#rol_viernes_').val('');
        if( jQuery('#viernes_').prop('checked') )
            jQuery('#rol_viernes_').val('1');
        else
            jQuery('#rol_viernes_').val('0');
    });

    jQuery('#sabado_').on('click',function(e){
        jQuery('#rol_sabado_').val('');
        if( jQuery('#sabado_').prop('checked') )
            jQuery('#rol_sabado_').val('1');
        else
            jQuery('#rol_sabado_').val('0');
    });

    function agregarPDV(e){
        e.preventDefault();

        if( jQuery('#form-agregar').valid() )
        {   
            console.log( jQuery('#form-agregar').serialize() );
            jQuery('#loader').show();
            jQuery.ajax({
                type:       'POST',
                url:        'ws/gac/pdv',
                dataType:   'json',
                data:       jQuery('#form-agregar').serialize(),
            })
            .done(function(data)
            {
                 if(data.result){
                    toastr['success'](data.message, 'Éxito');
                    jQuery('#modal-agregar').modal('hide');    
                    jQuery('#loader').fadeOut();
                    location.reload();
                }else{
                    toastr['error'](data.message, 'Error');
                    jQuery('#loader').fadeOut();
                }
            }).fail(function(e){
                toastr['error'](e.message, 'Error');
                    jQuery('#loader').fadeOut();
            }).always( function(all){
                jQuery('#loader').fadeOut();
            });
        }
        else
        {
            toastr['warning']('Hace falta información', 'Cuidado');
            console.log('falta informacion');
        }
    }

    function agregarDeudor(e){
        e.preventDefault();
        jQuery('#loader').show();
        if( jQuery('#form-agrego').valid() )
        {
            console.log( jQuery('#form-agrego').serialize() );
            jQuery.ajax({
                type:       'POST',
                url:        'ws/gac/pdv',
                dataType:   'json',
                data:       jQuery('#form-agrego').serialize(),
            })
            .done(function(data)
            {
                if(data.result){
                    toastr['success'](data.message, 'Éxito');
                    jQuery('#modal-agrego').modal('hide');    
                    jQuery('#loader').fadeOut();
                    location.reload();
                }else{
                    toastr['error'](data.message, 'Error');
                    jQuery('#loader').fadeOut();
                }
            }).fail(function(err){
                toastr['error'](err.message, 'Error');
                    jQuery('#loader').fadeOut();
            }).always( function(all){
                jQuery('#loader').fadeOut();
            });
        }
        else
        {
            toastr['error']('Hacen falta Datos en la solicitud', 'Error');
            jQuery('#loader').fadeOut();
        }
    }

    function nuevoPDV(e){
        e.preventDefault();
        if( jQuery('#form-nuevo').valid() )
        {
            console.log( jQuery('#form-nuevo').serialize() );
            jQuery.ajax({
                type:       'POST',
                url:        'ws/gac/pdv',
                dataType:   'json',
                data:       jQuery('#form-nuevo').serialize(),
            })
            .done(function(data)
            {
                if(data.result){
                    toastr['success'](data.message, 'Éxito');
                    jQuery('#modal-nuevo').modal('hide');    
                    jQuery('#loader').fadeOut();
                    location.reload();
                }else{
                    toastr['error'](data.message, 'Error');
                    jQuery('#loader').fadeOut();
                }
                
            }).fail(function(err){
                console.log(err);
                toastr['error'](err.message, 'Error');
            }).always( function(all){
                jQuery('#loader').fadeOut();
            });
        }
        else
            console.log('falta informacion');
    }

    jQuery('#btn-crear').on('click', function(e){
        e.preventDefault();



        jQuery('#loader').show();
        jQuery('.limpiar').val('');
        jQuery(".check").prop('checked', false);
        jQuery('#DEUD_LAND1_C').val(pais_codigo);
        jQuery('#LAND1_C').val(pais_codigo);
        jQuery('#DEUD_COUNC_').attr( 'disabled','true');
        jQuery('#DEUD_CITYC_').attr( 'disabled','true');
        jQuery('#COUNC_').attr( 'disabled','true');
        jQuery('#CITYC_').attr( 'disabled','true');
        jQuery('#rut_nuev').remove();

        jQuery.ajax({
            type:       'GET',
            url:        'ws/gac/codigos/consulta',
            dataType:   'json',
        })
        .done(function(data){
            jQuery('.negosnvs').remove();
            jQuery('.rutannvv').remove();
            jQuery.each( data.records.tipo_negocio, function( index,item ){
                jQuery('#tipo_neg_n').append('<option class="negosnvs" value="'+item.id+'" style="text-transform:capitalize;">'+item.id+' - '+item.valor.toLowerCase()+'</option>');
            });
            jQuery.each( data.records.tipo_rutas, function( index,item ){
                jQuery('#rutas_nueva').append('<option class="rutannvv" value="'+item.id+'" style="text-transform:capitalize;">'+item.id+' - '+item.valor.toLowerCase()+'</option>');
            });
        });


        jQuery.ajax({
            type:       'GET',
            url:        'ws/gac/codigos/consulta',
            dataType:   'json',
        })
        .done(function(data){
            jQuery('.negoss').remove();
            jQuery.each( data.records.tipo_id, function( index,item ){
                jQuery('#PAAT1_').append('<option class="negoss" value="'+item.id+'" style="text-transform:capitalize;">'+item.valor.toLowerCase()+'</option>');
            });
        });

        jQuery("#tb-busqueda").dataTable().fnClearTable();
        jQuery.ajax({
            type:       'GET',
            url:        'ws/gac/codigos/consulta',
            dataType:   'json',
        })
        .done(function(data){
            jQuery('.negocios').remove();
            jQuery.each( data.records.tipo_negocio, function( index,item ){
                jQuery('#BRSCH_').append('<option class="negocios" value="'+item.id+'" style="text-transform:capitalize;">'+item.valor.toLowerCase()+'</option>');
            });
        });

        jQuery('#DEUD_LAND1_').text(pais_nombre);
        jQuery('#LAND1_').text(pais_nombre);
        jQuery('.provincias').remove();
        jQuery('.cantones_').remove();
        jQuery('.cantones').remove();
        jQuery('.distritos_').remove();
        jQuery('.distritos').remove();
        jQuery.ajax(
        {
            type:       'GET',
            url:        'ws/gac/provincia?pais='+jQuery('#pais_usuario').val(),
            dataType:   'json',
        })
        .done(function(data)
        {
            if( data.result )
            {
                jQuery.each( data.records, function( index,item )
                {
                    if(item.BLAND!='000')
                        jQuery('#DEUD_REGIO_').append('<option class="provincias" value="'+item.BLAND+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                        jQuery('#REGIO_').append('<option class="provincias" value="'+item.BLAND+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                });
            }
            else
                toastr['error'](data.message, 'Error');
        }).fail(function(err){
            console.log( err.message );
            jQuery('#loader').fadeOut();
        }).always( function(){
            console.log('Completo');
        });
        jQuery('#loader').fadeOut();
    });

    jQuery('#REGIO_').on('change', function(e){
        e.preventDefault();
        if( jQuery('#REGIO_').val() && jQuery('#pais_usuario').val()=='CR' ){
            jQuery('#loader').show();
            jQuery('.cantones_').remove();
            jQuery('.distritos').remove();
            jQuery('#COUNC_').removeAttr( 'disabled','true');
            jQuery.ajax(
            {
                type:       'GET',
                url:        'ws/gac/cantones?pais='+jQuery('#pais_usuario').val()+'&provincia='+jQuery('#REGIO_').val(),
                dataType:   'json',
            })
            .done(function(data)
            {
                // console.log(data);
                if( data.result )
                {
                    jQuery.each( data.records, function( index,item )
                    {
                        if(item.COUNC!='000')
                            jQuery('#COUNC_').append('<option class="cantones_" value="'+item.COUNC+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                    });
                }
                else
                    toastr['error'](data.message, 'Error');
            }).fail(function(err){
                console.log( err );
            }).always( function(){
                jQuery('#loader').fadeOut();
            });
        }
        else{
            jQuery('#loader').show();
            if( jQuery('#REGIO_').val() && jQuery('#pais_usuario').val()!='CR' ){
                jQuery('.distritos_').remove('');
                jQuery('#CITYC_').removeAttr( 'disabled','true');
                jQuery.ajax(
                {
                    type:       'GET',
                    url:        'ws/gac/distritos?canton='+''+'&pais='+jQuery('#pais_usuario').val()+'&provincia='+jQuery('#REGIO_').val(),
                    dataType:   'json',
                })
                .done(function(data)
                {
                    // console.log(data);
                    if( data.result )
                    {
                        jQuery.each( data.records, function( index,item )
                        {
                            if(item.COUNC!='0000')
                                jQuery('#CITYC_').append('<option class="distritos_" value="'+item.CITYC+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                        });
                    }
                    else
                        toastr['error'](data.message, 'Error');
                }).fail(function(err){
                    console.log( err );
                }).always( function(){
                    jQuery('#loader').fadeOut();
                });
            }
            else
                jQuery('#CITYC_').attr( 'disabled','true');
                jQuery('#COUNC_').attr( 'disabled','true');
                jQuery('#loader').fadeOut();
        }
    });

    jQuery('#DEUD_REGIO_').on('change', function(e){
        e.preventDefault();
        if( jQuery('#DEUD_REGIO_').val() && jQuery('#pais_usuario').val()=='CR' ){
            jQuery('#loader').show();
            jQuery('#DEUD_COUNC_').removeAttr( 'disabled','true');
            jQuery.ajax(
            {
                type:       'GET',
                url:        'ws/gac/cantones?pais='+jQuery('#pais_usuario').val()+'&provincia='+jQuery('#DEUD_REGIO_').val(),
                dataType:   'json',
            })
            .done(function(data)
            {
                // console.log(data);
                jQuery('#DEUD_CITYC_').attr( 'disabled','true');
                jQuery('.cantones').remove('');

                if( data.result )
                {
                    jQuery.each( data.records, function( index,item )
                    {
                        if(item.COUNC!='000')
                            jQuery('#DEUD_COUNC_').append('<option class="cantones" value="'+item.COUNC+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                    });
                }
                else
                    toastr['error'](data.message, 'Error');
                
                jQuery('#loader').fadeOut();
            }).fail(function(err){
                console.log( err );
                jQuery('#loader').fadeOut();
            }).always( function(){
                jQuery('#loader').fadeOut();
            });
        }
        else{
            jQuery('#loader').show();
            if( jQuery('#DEUD_REGIO_').val() && jQuery('#pais_usuario').val()!='CR' ){
                jQuery('#DEUD_CITYC_').removeAttr( 'disabled','true');
                jQuery.ajax(
                {
                    type:       'GET',
                    url:        'ws/gac/distritos?canton='+''+'&pais='+jQuery('#pais_usuario').val()+'&provincia='+jQuery('#DEUD_REGIO_').val(),
                    dataType:   'json',
                })
                .done(function(data)
                {
                    // console.log(data);
                    jQuery('.distritos').remove('');
                    if( data.result )
                    {
                        jQuery.each( data.records, function( index,item )
                        {
                            if(item.COUNC!='0000')
                                jQuery('#DEUD_CITYC_').append('<option class="distritos" value="'+item.CITYC+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                        });
                    }
                    else
                        toastr['error'](data.message, 'Error');
                }).fail(function(err){
                    console.log( err );
                }).always( function(){
                    jQuery('#loader').fadeOut();
                });
            }
            else
                jQuery('#DEUD_CITYC_').attr( 'disabled','true');
                jQuery('#DEUD_COUNC_').attr( 'disabled','true');
                jQuery('#loader').fadeOut();
        }
    });

    jQuery('#COUNC_').on('change', function(e){
        e.preventDefault();
        jQuery('#loader').show();
        if( jQuery('#COUNC_').val() ){
            jQuery('.distritos_').remove();
                jQuery('#CITYC_').removeAttr( 'disabled','true');
                jQuery.ajax(
                {
                    type:       'GET',
                    url:        'ws/gac/distritos?canton='+jQuery('#COUNC_').val()+'&pais='+jQuery('#pais_usuario').val()+'&provincia='+jQuery('#REGIO_').val(),
                    dataType:   'json',
                })
                .done(function(data)
                {
                    if( data.result )
                    {
                        jQuery.each( data.records, function( index,item )
                        {
                            if(item.COUNC!='0000')
                                jQuery('#CITYC_').append('<option class="distritos_" value="'+item.CITYC+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                        });
                    }
                    else
                        toastr['error'](data.message, 'Error');
                }).fail(function(err){
                    console.log( err );
                }).always( function(){
                    jQuery('#loader').fadeOut();
                });

        }else
            jQuery('#CITYC_').attr( 'disabled','true');
            jQuery('#loader').fadeOut();
    });

    jQuery('#DEUD_COUNC_').on('change', function(e){
        e.preventDefault();
        jQuery('#loader').show();
        if( jQuery('#DEUD_COUNC_').val() ){
                jQuery('#DEUD_CITYC_').removeAttr( 'disabled','true');
                jQuery.ajax(
                {
                    type:       'GET',
                    url:        'ws/gac/distritos?canton='+jQuery('#DEUD_COUNC_').val()+'&pais='+jQuery('#pais_usuario').val()+'&provincia='+jQuery('#DEUD_REGIO_').val(),
                    dataType:   'json',
                })
                .done(function(data)
                {
                    // console.log(data);
                    jQuery('.distritos').remove();
                    if( data.result )
                    {
                        jQuery.each( data.records, function( index,item )
                        {
                            if(item.COUNC!='0000')
                                jQuery('#DEUD_CITYC_').append('<option class="distritos" value="'+item.CITYC+'" style="text-transform:capitalize;"> '+item.BEZEI.toLowerCase()+'</option>');
                        });
                    }
                    else
                        toastr['error'](data.message, 'Error');
                }).fail(function(err){
                    console.log( err );
                }).always( function(){
                    jQuery('#loader').fadeOut();
                });

        }else
            jQuery('#DEUD_CITYC_').attr( 'disabled','true');
            jQuery('#loader').fadeOut();
    });

    function valornulo( valor, tipo ){
        if( tipo=='1' ){
            if(valor == '0' || valor == '' || valor == ' ' /*|| valor == 'Undefined'*/)
                return '';
            else
                return ', '+valor;
        }
        else{
            if(valor == '0' || valor == '' /*|| valor == 'Undefined'*/)
                return 'Sin asignar';
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
});
