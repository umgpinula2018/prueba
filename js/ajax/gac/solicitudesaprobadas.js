jQuery( document ).ready( function( e ){
    var pais_codigo='';
    var pais_nombre=''
    jQuery('#loader').show();
    var registro='';
    var codigo='';
    var codigos=[];
    window.tablaAreas = jQuery("#tb-busqueda").DataTable({
        "aaSorting":[[0,"desc"]],
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
    
    BD_cargar();
    jQuery('#tb-busqueda').on('click','.btn-detalle', detalles);

    function BD_cargar(){       
        jQuery.ajax({
            url:        'ws/gac/buscar/sociedades?email='+localStorage.USUARIO,
            type:       'GET',
            dataType:   'json',
        }).done(function(data){ 
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

                jQuery('#pais').val(pais_codigo);
                switch( pais_codigo )
                {
                    case 'CR':
                        jQuery('.A').text('Número de Identificación Fiscal');
                        jQuery('.B').text('Provincia');
                        jQuery('.C').text('Tipo de Número de Identificación Fiscal');
                        jQuery('.D').text('Cantón');
                        jQuery('.E').text('Distrito');
                        jQuery('.F').text('Barrio');
                        jQuery('#ZLATITUD').val('10');
                        jQuery('#ZLONG').val('83-');
                    break;

                    case 'GT':
                        jQuery('.A').text('NIT');
                        jQuery('.B').text('Departamento');
                        jQuery('.C').text('Tipo de NIT');
                        jQuery('.DD').hide();
                        jQuery('.E').text('Municipio');
                        jQuery('.F').text('Zona');
                        jQuery('#ZLATITUD').val('17');
                        jQuery('#ZLONG').val('90-');
                        jQuery('#DEUD_COUNC').remove();
                    break;

                    case 'SV':
                        jQuery('.A').text('NIT');
                        jQuery('.B').text('Departamento');
                        jQuery('.C').text('Tipo de NIT');
                        jQuery('.DD').hide();
                        jQuery('.E').text('Municipio');
                        jQuery('.F').text('Zona');
                        jQuery('#DEUD_COUNC').remove();
                    break;
                }

                window.tablaAreas.clear().draw();
                jQuery('#loader').show();
                jQuery.ajax({
                    type:       'POST',
                    url:        'ws/gac/solicitudes/procesadas',
                    dataType:   'json',
                    data:       { 'pais':jQuery('#pais').val(), status: jQuery('#status').val(), pernr: localStorage.EMPID, email: localStorage.USUARIO },
                })
                .done(function(result){
                    // console.log(contar);
                    if( result.result && result.records.TA_FORMULARIO){
                        // console.log(result);
                        // console.log(result.records.TA_FORMULARIO.item.size());
                        var contar=result.records.TA_FORMULARIO.item.length;
                        var forms = result.records.TA_FORMULARIO.item;
                        jQuery.each( forms, function( index,value ){

                            jQuery.ajax({
                                type:       'POST',
                                url:        'ws/gac/deudor/buscar/formulario',
                                dataType:   'json',
                                data:       { 'buscar': value.CONSEC },
                            })
                            .done(function(data){
                                var boton='nada';
                                if( value.DES_TIPO_SOL == "Modificaciones" )
                                    boton='<span style="font-size:13px;" class="label label-default"> <i class="fa fa-pencil"> Modificacion</i></span>';
                                else
                                    if( value.DES_TIPO_SOL == "Inclusiones" )
                                        boton='<span style="font-size:13px;" class="label label-default"> <i class="fa fa-plus"> Inclusión</i></span>';
                                    else
                                        boton='<span style="font-size:13px;" class="label label-warning"> <i class="fa fa-exclamation"> Sin Asignar</i></span>';

                                switch(data.records.EX_TIPO_MOV){
                                    case 'A':   var mov= '<i>Nuevo PDV y Deudor </i>'; break;
                                    case 'B':   var mov= '<i>Nuevo PDV</i>'; break;//se cambio la letra con C
                                    case 'C':   var mov= '<i>Nuevo Deudor </i>'; break;//se cambio la letra con B
                                    case 'D':   var mov= '<i>Modificacion PDV</span> </i>'; break;//aca aparecen los Deudores modificados
                                    case 'E':   var mov= '<i>Modificacion PDV y Deudor </i>'; break;
                                    case 'F':   var mov= '<i>Modificacion Deudor </i>';/*var mov='<i>Modificacion Deudor </i>';*/ break;
                                    default:    var mov= '<i>Sin Asignar </i>'; break;
                                }
                                // A = Creación PDV con deudor nuevo
                                // B = Creación PDV con deudor existente
                                // C = Creación Deudor con PDV existente
                                // D = Modificar PDV sin cambiar deudor
                                // E = Modificar PDV cambiando deudor
                                // F = Modificar Deudor

                                if(value.NOMBRE_PDV)
                                    var pdv = value.NOMBRE_PDV;
                                else
                                    var pdv='Sin Asignar';

                                counter1 = value.CONSEC;
                                counter2 = pdv;
                                counter3 = value.NOMBRE;                
                                counter4 = value.FCREADO;
                                counter5 = value.FAPROB_SUP;
                                // counter6 = value.OBSERVAC;
                                counter7 = boton;
                                
                                window.tablaAreas.row.add([counter1,counter2,counter3,counter4,counter5/*,counter6*/,counter7]).draw(false);
                                if( index == parseInt(contar-1))
                                    jQuery('#loader').fadeOut();
                                
                            }).always(function(data){
                                // jQuery('#loader').fadeOut();
                            });
                        });
                        
                    }else{
                        toastr['success']('No hay Solicitudes aprobadas', 'Éxito');
                        jQuery('#loader').fadeOut();
                    }
                }).fail(function(err){
                    console.log(err);
                    toastr['error'](err.message, 'Error');
                    jQuery('#loader').fadeOut();
                }).always(function(data){
                    // jQuery('#loader').fadeOut();
                }); 

            }
            else
                toastr['error'](data.message, 'Error');
        })
        .fail(function(err)
        {
            console.log(err);
        })  
        .always( function()
        {
            // jQuery("#loader").fadeOut();
            
        });   

    }


    function detalles ( e ){
        e.preventDefault();
        var Deudor=[];
        var PDV=[];
        var Creditos=[];
        jQuery('#loader').show();
        var con = jQuery(this).data('con');
        var tip = jQuery(this).data('tip');
        // console.log(con);
        jQuery('.con').val(con);
        if (tip =='F'){
            jQuery('.Deudor').show();
            jQuery('.PDV').fadeOut();
            jQuery('.Credito').fadeOut();
        }
            
        jQuery.ajax({
            type:       'POST',
            url:        'ws/gac/deudor/buscar/formulario',
            dataType:   'json',
            data:       { 'buscar':con },
        })
        .done(function(Deudor){
            if( Deudor.result){
                Deudors=Deudor.records.TA_INFO_DEUDOR.item;
                PDVs=Deudor.records.TA_INFO_PDV.item;
                Creditos=Deudor.records.EX_SOLICITUD_CREDITO;
                // console.log( Deudor );
                // console.log( PDVs );
                // console.log( Creditos );
                switch( Deudors.DEUD_LAND1 )
                {
                    case 'CR':
                        jQuery('.A').text('Número de Identificación Fiscal');
                        jQuery('.B').text('Provincia');
                        jQuery('.C').text('Canton');
                        jQuery('.D').text('Distrito');
                        jQuery('.E').text('Barrio');
                    break;

                    case 'GT':
                        jQuery('.A').text('NIT');
                        jQuery('.B').text('Departamento');
                        jQuery('.CC').hide('');
                        jQuery('.D').text('Municipio');
                        jQuery('.E').text('Zona');
                    break;
                }
                
                
                
                // console.log(Creditos);
                //Deudor Información
                // console.log(tip);
                switch( tip ){
                    case 'A':       jQuery('#myModalLabel').text('Nuevo PDV y Nuevo PDF');     break;
                    case 'A':       jQuery('#myModalLabel').text();     break;
                }
                var tipo='';var pat='';
                Deudors.STKZN!=''?tipo='Persona Física':tipo='Persona Jurídica';
                jQuery('#tipo').text(tipo);
                if ( !Deudors.STKZN=='' ){
                    jQuery('#contenido-juridico_n').hide();
                    jQuery('.P1').text(' Deudor');
                    jQuery('.P2').text(' # Documento ID');
                    jQuery('.P3').text(' Tipo doc ID');
                }else{
                    jQuery('#contenido-juridico_n').show();
                    // console.log( 'visible (Jurídico) : '+Deudors.STKZN  );
                    jQuery('.P1').text(' Sociedad');
                    jQuery('.P2').text(' Cédula Jurídica');
                    jQuery('.P3').text(' Tipo de doc. Jurídico');
                }
                jQuery('#ZLONG').text(' '+valornulo(Deudors.ZLONG));
                jQuery('#ZLATITUD').text(' '+valornulo(Deudors.ZLATITUD));




                if( Deudors.AD_NAME1 && Deudors.DEUD_REGIO_DESC && Deudors.AD_NAME1!=' ' && Deudors.DEUD_REGIO_DESC!=' ' ){
                    // console.log('mostrar deudor');
                    jQuery('#Deudor_encabezado').show();
                }
                else{
                    jQuery('#Deudor_encabezado').hide();
                    // console.log('esconder deudor');
                }
                    

                if( PDVs.NOMBRE_PDV && PDVs.NOMBRE_PDV!=' '){
                    jQuery('#PDV_encabezado').show();
                    // console.log('mostrar PDV');
                }
                else{
                    jQuery('#PDV_encabezado').hide();
                    // console.log('esconder PDV');
                }

                // console.log(Deudors.AD_NAME1+' ** '+Deudors.DEUD_REGIO_DESC);
                // console.log(PDVs.NOMBRE_PDV+' ** '+PDVs.KUNNR);


                jQuery('#AD_NAMEFIR').text(' '+valornulo(Deudors.AD_NAMEFIR.toLowerCase()));
                jQuery('#AD_NAME2_P').text(' '+valornulo(Deudors.AD_NAME2_P.toLowerCase()));
                jQuery('#codigo').text(' '+Deudors.STCD1+' ');
                jQuery('#deudor').text(' '+Deudors.AD_NAME1.toLowerCase()+' ');
                jQuery('#provincia').text(' '+Deudors.DEUD_REGIO_DESC.toLowerCase());
                jQuery('#canton').text(' '+valornulo(Deudors.DEUD_COUNC_DESC.toLowerCase()));
                jQuery('#distrito').text(' '+Deudors.DEUD_CITYC_DESC.toLowerCase());
                jQuery('#ciudad').text(' '+Deudors.DEUD_LAND1_DESC.toLowerCase());
                jQuery('#senas').text(' '+valornulo(Deudors.DEUD_AD_NAME_CO.toLowerCase()));
                jQuery('#barrio').text(' '+valornulo(Deudors.DEUD_AD_STRSPP3.toLowerCase()));
                jQuery('#telefono1').text(' '+valornulo(Deudors.CONT_TELEF1));
                jQuery('#telefono2').text(' '+valornulo(Deudors.CONT_TELEF2));
                jQuery('#telefono3').text(' '+valornulo(Deudors.CONT_TELEF3));
                jQuery('#correo').text(' '+valornulo(Deudors.AD_SMTPADR.toUpperCase()));
                jQuery('#televenta').text(' '+Deudors.IND_TELEVENTA=='S'?'Si':'No');
                //PDV Información
                jQuery('#ampliado').text(' Pendiente '/*+PDVs.AMPH*/);
                jQuery('#negocio').text(' '+PDVs.NOMBRE_PDV);
                jQuery('#KUNNR').text(' '+PDVs.KUNNR);
                jQuery('#patente').text(' '+valornulo(PDVs.DKTXT));
                PDVs.DZTERM?pat=PDVs.DZTERM:pat='No';
                jQuery('#licencia').text(' '+pat);
                jQuery('#provincia_pdv').text(' '+PDVs.REGIO_DESC.toLowerCase());
                jQuery('#canton_pdv').text(' '+valornulo(PDVs.COUNC_DESC.toLowerCase()));
                jQuery('#distrito_pdv').text(' '+PDVs.CITYC_DESC.toLowerCase());
                jQuery('#ciudad_pdv').text(' '+PDVs.LAND1_DESC.toLowerCase());
                jQuery('#barrio_pdv').text(' '+valornulo(PDVs.AD_STRSPP3.toLowerCase()));
                jQuery('#sena_pdv').text(' '+valornulo(PDVs.AD_NAME_CO.toLowerCase()));
                jQuery('#tel1_pdv').text(' '+valornulo(PDVs.TELF1));
                jQuery('#tel2_pdv').text(' '+valornulo(PDVs.TELF2));
                jQuery('#tel3_pdv').text(' '+valornulo(PDVs.TELFX));
                jQuery('#tipo_pdv').text(' '+valornulo(PDVs.BRSCH_DESC));
                if( PDVs.BZIRK ){
                    jQuery.ajax({
                        type:       'GET',
                        url:        'ws/gac/codigos/consulta',
                        dataType:   'json',
                    })
                    .done(function(data){
                        jQuery.each( data.records.tipo_rutas, function( index,value ){
                            if(value.id ==PDVs.BZIRK)
                                jQuery('#ruta').text(' '+value.valor);
                        });
                    }).fail(function(err){
                        toastr['error'](err.message, 'Error');
                    });
                }else{
                    jQuery('#ruta').text('Sin Asignar');
                }
                
                if( PDVs.BRSCH ){
                     jQuery.ajax({
                        type:       'GET',
                        url:        'ws/gac/codigos/consulta',
                        dataType:   'json',
                    })
                    .done(function(data){
                        jQuery.each( data.records.tipo_negocio, function( index,value ){
                            if(value.id ==PDVs.BRSCH)
                                jQuery('#tipon_pdv').text(' '+value.valor);
                        });
                    }).fail(function(err){
                        toastr['error'](err.message, 'Error');
                    });
                }else{
                    jQuery('#tipon_pdv').text('Sin Asignar');
                }
                   
                
                if( PDVs.ORDEN_LUNES=='1' ){
                    jQuery('#ORDEN_LUNES_B').attr('checked','checked');
                    jQuery('#rol_lunes_B').val('1');
                }else{
                    jQuery('#ORDEN_LUNES_B').removeAttr('checked');
                    jQuery('#rol_lunes_B').val('0');
                }

                if( PDVs.ORDEN_MARTES=='1' ){
                    jQuery('#ORDEN_MARTES_B').attr('checked','checked');
                    jQuery('#rol_martes_B').val('1');
                }else{
                    jQuery('#ORDEN_MARTES_B').removeAttr('checked');
                    jQuery('#rol_martes_B').val('0');
                }

                if( PDVs.ORDEN_MIERCOLES=='1' ){
                    jQuery('#ORDEN_MIERCOLES_B').attr('checked','checked');
                    jQuery('#rol_miercoles_B').val('1');
                }else{
                    jQuery('#ORDEN_MIERCOLES_B').removeAttr('checked');
                    jQuery('#rol_miercoles_B').val('0');
                }

                if( PDVs.ORDEN_JUEVES=='1' ){
                    jQuery('#ORDEN_JUEVES_B').attr('checked','checked');
                    jQuery('#rol_jueves_B').val('1');
                }else{
                    jQuery('#ORDEN_JUEVES_B').removeAttr('checked');
                    jQuery('#rol_jueves_B').val('0');
                }

                if( PDVs.ORDEN_VIERNES=='1' ){
                    jQuery('#ORDEN_VIERNES_B').attr('checked','checked');
                    jQuery('#rol_viernes_B').val('1');
                }else{
                    jQuery('#ORDEN_VIERNES_B').removeAttr('checked');
                    jQuery('#rol_viernes_B').val('0');
                }

                if( PDVs.ORDEN_SABADO=='1' ){
                    jQuery('#ORDEN_SABADO_B').attr('checked','checked');
                    jQuery('#rol_sabado_B').val('1');
                }else{
                    jQuery('#ORDEN_SABADO_B').removeAttr('checked');
                    jQuery('#rol_sabado_B').val('0');
                }

                // jQuery('#rol_visitas').text(' '+contenido);
                jQuery('#visita_pdv').text(' Pendiente '/*+valornulo(PDVs.xxx)*/);
                jQuery('#rutaa_pdv').text( ' Pendiente '/*+PDVs.*/);
                jQuery('#rutana_pdv').text( ' Pendiente '/*+PDVs.*/);
                jQuery('#zona_pdv').text( ' Pendiente '/*+PDVs.*/);
                jQuery('#frecuencia_pdv').text( ' '+frecuenciavisitas( PDVs.FREC_VISITA ) );
                // console.log(Creditos);
                jQuery('#alcoholico').text(' '+ parseFloat(Creditos.ALCOHOLICO).toFixed(2));
                jQuery('#no_alcoholico').text(' '+ parseFloat(Creditos.NO_ALCOHOLICO).toFixed(2));
                jQuery('#alimentos').text(' '+ parseFloat(Creditos.ALIMENTOS).toFixed(2));
                jQuery('#vinos_dest').text(' '+ parseFloat(Creditos.VINOS_DEST).toFixed(2));
                jQuery('#vinum').text(' '+ parseFloat(Creditos.VINUM).toFixed(2));
                jQuery('#artesanal').text(' '+ parseFloat(Creditos.ARTESANAL).toFixed(2));
                jQuery('#total').text(parseFloat((Creditos.ALCOHOLICO)+parseFloat(Creditos.NO_ALCOHOLICO)+parseFloat(Creditos.ALIMENTOS)+parseFloat(Creditos.VINOS_DEST)+parseFloat(Creditos.VINUM)+parseFloat(Creditos.ARTESANAL)).toFixed(2));
                jQuery('#loader').fadeOut();
            }else{
                // jQuery('#modal-detalle').modal('hide')
                toastr['warning']('No hay solicitudes', 'Cuidad');
                jQuery('#loader').fadeOut();
            }


        })
        .fail(function(err){
            // jQuery('#modal-detalle').modal('hide')
            console.log(err);
            toastr['error'](err.message, 'Error');
            jQuery('#loader').fadeOut();
        }); 
    }

    function valornulo( valor ){
        if(valor == '0' || valor == '' /*|| valor == 'Undefined'*/)
            return 'Sin asignar';
        else
            return valor;
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