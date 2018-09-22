jQuery( document ).ready( function( e ){
    var pais_codigo='';
    var pais_nombre=''
    jQuery('#loader').show();
    var registro='';
    var codigo='';
    var codigos=[];
    jQuery('.input-date-picker').datepicker({
        format: 'yyyy-mm-dd',
        orientation: "bottom",
        daysOfWeekDisabled: "7",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true
    });
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
                    if( result.result && result.records.TA_FORMULARIO ){
                        jQuery.each( result.records.TA_FORMULARIO.item, function( index,value ){
                            jQuery.ajax({
                                type:       'POST',
                                url:        'ws/gac/deudor/buscar/formulario',
                                dataType:   'json',
                                data:       { 'buscar': value.CONSEC },
                            }).done(function(data){
                                var boton='nada';
                                if( value.DES_TIPO_SOL == "Modificaciones" )
                                    boton='<span style="font-size:13px;" class="label label-default"> <i class="fa fa-pencil"> Modificacion</i></span>';
                                else
                                    if( value.DES_TIPO_SOL == "Inclusiones" )
                                        boton='<span style="font-size:13px;" class="label label-default"> <i class="fa fa-plus"> Inclusión</i></span>';
                                    else
                                        boton='<span style="font-size:13px;" class="label label-info"> <i class="fa fa-refresh"> Reenvio</i></span>';

                                switch(data.records.EX_TIPO_MOV){
                                    case 'A':   var mov= '<i>Nuevo PDV y Deudor </i>'; break;
                                    case 'B':   var mov= '<i>Nuevo PDV</i>'; break;//se cambio la letra con C
                                    case 'C':   var mov= '<i>Nuevo Deudor </i>'; break;//se cambio la letra con B
                                    case 'D':   var mov= '<i>Modificacion PDV </i>'; break;//aca aparecen los Deudores modificados
                                    case 'E':   var mov= '<i>Modificacion PDV y Deudor </i>'; break;
                                    case 'F':   var mov= '<i>Modificacion Deudor </i>';var mov='<i>Modificacion Deudor </i>'; break;
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
                                counter4 = value.FAPROB_SUP;
                                counter5 = value.FCREADO;
                                counter6 = value.OBSERVAC;
                                counter7 = boton;
                                counter8 = '<a data-placement="top" title="Desactivar permisos" class="toltip btn-detalle btn btn-primary btn-xs" href="#modal-detalle" data-toggle="modal" data-men="'+value.OBSERVAC+'" data-tip="'+data.records.EX_TIPO_MOV+'" data-con="'+value.CONSEC+'" ><i class="fa fa-pencil"> Ver</i></a>' ;

                                window.tablaAreas.row.add([counter1,counter2,counter3,counter4,counter5,counter6,counter7,counter8]).draw(false);
                                if( index == parseInt(result.records.TA_FORMULARIO.item.length-1))
                                    jQuery('#loader').fadeOut();
                            }).always(function(data){
                                // jQuery('#loader').fadeOut();
                            });
                        });
                    }else{
                        toastr['success'](result.message, 'Éxito');
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

    jQuery('#LICENCIA_LICOR').on('change',function(e){
        e.preventDefault();
        if( jQuery('#LICENCIA_LICOR').val() == 'S' )
            jQuery('#DKTXT_LICOR').removeAttr('disabled');
        else
            jQuery('#DKTXT_LICOR').attr('disabled', 'true');
    });

    jQuery('#reenviar').on('click',function(e){
        e.preventDefault();
        if( jQuery('#IM_TIPO_MOV').val() == 'D' || jQuery('#IM_TIPO_MOV').val() == 'E'){
            jQuery('#AD_NAME1').val('');
            jQuery('#STKZN').val('');
            jQuery('#AD_NAMEFIR').val('');
            jQuery('#KUNNR').val('');
            jQuery('#AD_NAME2_P').val('');
            jQuery('#STCD1').val('');
            jQuery('#PAAT1').val('');
            jQuery('#DEUD_REGIO').val('');
            jQuery('#DEUD_CITYC').val('');
            jQuery('#DEUD_LAND1').val('');
            jQuery('#DEUD_AD_STRSPP3').val('');
            jQuery('#DEUD_AD_NAME_CO').val('');
            jQuery('#CONT_TELEF1').val('');
            jQuery('#CONT_TELEF2').val('');
            jQuery('#CONT_TELEF3').val('');
            jQuery('#AD_SMTPADR').val('');
        }

        if( jQuery('#form-reenviar').valid() ){   
            // console.log( jQuery('#form-reenviar').serialize() );
            jQuery('#loader').show();
            jQuery.ajax({
                type:       'POST',
                url:        'ws/gac/pdv',
                dataType:   'json',
                data:       jQuery('#form-reenviar').serialize(),
            })
            .done(function(data)
            {
                 if(data.result){
                    toastr['success'](data.message, 'Éxito');
                    jQuery('#modal-detalle').modal('hide');  
                    BD_cargar();  
                    jQuery('#loader').fadeOut();
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
            // console.log('falta informacion');
        }
        //
    });


    function detalles ( e ){
        e.preventDefault();
        switch( jQuery('#pais').val() )
        {
            case 'CR':
                jQuery('.DD').show();
            break;

            case 'GT':
                jQuery('.DD').hide();
            break;

            case 'SV':
                jQuery('.DD').hide();
            break;
        }

        jQuery('.provincias').remove();
        jQuery('.cantones').remove();
        jQuery('.distritos').remove();
        var Deudor=[];
        var PDV=[];
        var Creditos=[];
        jQuery('#loader').show();
        var con = jQuery(this).data('con');
        var tip = jQuery(this).data('tip');
        var men = jQuery(this).data('men');
        jQuery('.con').val(con);

        //////////////////////////////////////////////////////////////////////
        jQuery('.cont-limites').remove();
        jQuery('#Deudor_encabezado').show();
        jQuery('#PDV_encabezado').show();
        jQuery('#limites_encabezado').hide();
        if (tip =='F' || tip =='E'){
            jQuery('#PDV_encabezado').hide();
        }else{
            if(tip =='D'){
                jQuery('#Deudor_encabezado').hide();
            }else{
                if(tip =='G'){
                    jQuery('#Deudor_encabezado').hide();
                    jQuery('#PDV_encabezado').hide();
                    jQuery('#limites_encabezado').show();
                }
            }
        }
        //////////////////////////////////////////////////////////////////////

        if( tip != 'G' ){
            jQuery.ajax({
                type:       'POST',
                url:        'ws/gac/deudor/buscar/formulario',
                dataType:   'json',
                data:       { 'buscar':con },
            })
            .done(function(Deudor){
                // console.log( Deudor.records );
                if( Deudor.result ){
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

                    switch(tip){
                        case 'A':   var mov= 'Nuevo PDV y Deudor'; break;
                        case 'B':   var mov= 'Nuevo PDV</i>'; break;//se cambio la letra con C
                        case 'C':   var mov= 'Nuevo Deudor'; break;//se cambio la letra con B
                        case 'D':   var mov= 'Modificacion PDV'; break;//aca aparecen los Deudores modificados
                        case 'E':   var mov= 'Modificacion PDV y Deudor'; break;
                        case 'F':   var mov= 'Modificacion Deudor';/*'<i>Modificacion Deudor';*/ break;
                        default:    var mov= 'Sin Asignar'; break;
                    }

                    jQuery('#myModalLabel').text(mov);

                    var tipo='';var pat='';
                    Deudors.STKZN=='X'?tipo='Persona Física':tipo='Persona Jurídica';
                    jQuery('#tipo').text(tipo);
                    // console.log(Deudors.STKZN);
                    if ( Deudors.STKZN=='X' ){
                        jQuery('#contenido-juridico').hide();
                        jQuery('.P1').text(' Deudor');
                        jQuery('.P2').text(' # Documento ID');
                        jQuery('.P3').text(' Tipo doc ID');
                    }else{
                        jQuery('#contenido-juridico').show();
                        // console.log( 'visible (Jurídico) : '+Deudors.STKZN  );
                        jQuery('.P1').text(' Sociedad');
                        jQuery('.P2').text(' Cédula Jurídica');
                        jQuery('.P3').text(' Tipo de doc. Jurídico');
                    }
                    jQuery('#STKZN > option[value="'+Deudors.STKZN+'"]').attr('selected', 'selected');
                    jQuery('#ZLONG').text(' '+valornulo(Deudors.ZLONG));
                    jQuery('#ZLATITUD').text(' '+valornulo(Deudors.ZLATITUD));

                                          
                    jQuery('#STCD1').val(valornulo(Deudors.STCD1));
                    jQuery('#PAAT1').val(valornulo(Deudors.PAAT1));
                    jQuery('#AD_NAMEFIR').val(valornulo(Deudors.AD_NAMEFIR.toLowerCase()));
                    jQuery('#AD_NAME2_P').val(valornulo(Deudors.AD_NAME2_P.toLowerCase()));
                    jQuery('#codigo > option[value="'+Deudors.STCD1+'"]').attr('selected', 'selected');
                    jQuery('#AD_NAME1').val(Deudors.AD_NAME1.toLowerCase()+' ');
                    jQuery('#provincia').val(Deudors.DEUD_REGIO_DESC.toLowerCase());
                    jQuery('#canton').val(valornulo(Deudors.DEUD_COUNC_DESC.toLowerCase()));
                    jQuery('#distrito').val(Deudors.DEUD_CITYC_DESC.toLowerCase());
                    jQuery('#ciudad').val(Deudors.DEUD_LAND1_DESC.toLowerCase());
                    jQuery('#DEUD_LAND1').val(Deudors.DEUD_LAND1.toLowerCase());
                    jQuery('#senas').val(valornulo(Deudors.DEUD_AD_NAME_CO.toLowerCase()));
                    jQuery('#barrio').val(valornulo(Deudors.DEUD_AD_STRSPP3.toLowerCase()));
                    jQuery('#telefono1').val(valornulo(Deudors.CONT_TELEF1));
                    jQuery('#telefono2').val(valornulo(Deudors.CONT_TELEF2));
                    jQuery('#telefono3').val(valornulo(Deudors.CONT_TELEF3));
                    jQuery('#correo').val(valornulo(Deudors.AD_SMTPADR.toUpperCase()));
                    jQuery('#televenta').val(Deudors.IND_TELEVENTA=='S'?'Si':'No');
                    jQuery('#IM_TIPO_MOV ').val(tip);
                    jQuery('#EX_CONSEC ').val(con);
                    jQuery('#mensaje ').val(men);
                    jQuery('#KUNNR').text(valornulo(Deudors.KUNNR));
                    jQuery('#Z_TIPO_MOV').text(valornulo(Deudors.ZTIPO_MOV));



                    // DEUD_REGIO
                    jQuery.ajax({
                        type:       'GET',
                        url:        'ws/gac/provincia?pais='+jQuery('#pais').val(),
                        dataType:   'json',
                    })
                    .done(function(data){
                        if( data.result )
                        {
                            jQuery('.provinciasd').remove();
                            jQuery.each( data.records, function( index,item )
                            {
                                if(item.BLAND!='000')
                                    if(Deudors.DEUD_REGIO==item.BLAND)
                                        jQuery('#DEUD_REGIO').append('<option class="provinciasd" selected value="'+item.BLAND+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                                    else
                                        jQuery('#DEUD_REGIO').append('<option class="provinciasd" value="'+item.BLAND+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                            });
                        }
                        else
                            toastr['error'](data.message, 'Error');
                    }).fail(function(err){
                        console.log( err.message );
                        jQuery('#loader').fadeOut();
                    }).always( function(){
                        // console.log('Completo');
                    });

                    //DEUD_COUNC
                    if( jQuery('#pais').val()=='CR' ){
                        jQuery.ajax({
                            type:       'GET',
                            url:        'ws/gac/cantones?pais='+jQuery('#pais').val()+'&provincia='+Deudors.DEUD_REGIO,
                            dataType:   'json',
                        })
                        .done(function(data){
                            if( data.result )
                            {
                                jQuery('.cantonesd').remove();
                                jQuery.each( data.records, function( index,item ){
                                    // console.log(item);

                                    if(item.BLAND!='000')
                                        if(Deudors.DEUD_COUNC==item.COUNC)
                                            jQuery('#DEUD_COUNC').append('<option class="cantonesd" selected value="'+item.COUNC+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                                        else
                                            jQuery('#DEUD_COUNC').append('<option class="cantonesd" value="'+item.COUNC+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
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
                    //DEUD_CITYC
                    jQuery.ajax({
                        type:       'GET',
                        url:        'ws/gac/distritos?canton='+Deudors.DEUD_COUNC+'&pais='+jQuery('#pais').val()+'&provincia='+Deudors.DEUD_REGIO,
                        dataType:   'json',
                    }).done(function(data){
                        if( data.result )
                        {
                            jQuery('.distritosd').remove();
                            jQuery.each( data.records, function( index,item )
                            {
                                if(item.DEUD_CITYC!='000')
                                    if(Deudors.DEUD_CITYC==item.COUNC)
                                        jQuery('#DEUD_CITYC').append('<option class="distritosd" selected value="'+item.CITYC+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                                    else
                                        jQuery('#DEUD_CITYC').append('<option class="distritosd" value="'+item.CITYC+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');

                            });
                        }
                        else
                            toastr['error'](data.message, 'Error');
                    }).fail(function(err){
                        console.log( err );
                    }).always( function(){
                        jQuery('#loader').fadeOut();
                    });

                    //PDV Información
                    jQuery('#LAND1').val(PDVs.LAND1);
                    // console.log( PDVs.LAND1 );
                    jQuery('#KUNNRPDV').text(valornulo(PDVs.KUNNR));
                    jQuery('#DEUDOR').text(valornulo(PDVs.DEUDOR));
                    jQuery('#ampliado').val(' Pendiente '/*+PDVs.AMPH*/);
                    jQuery('#NOMBRE_PDV').val(PDVs.NOMBRE_PDV);
                    jQuery('#KUNNR').val(PDVs.KUNNR);
                    jQuery('#patente').val(valornulo(PDVs.DKTXT));
                    PDVs.DZTERM?pat=PDVs.DZTERM:pat='No';
                    jQuery('#licencia').val(pat);
                    jQuery('#provincia_pdv').val(PDVs.REGIO_DESC.toLowerCase());
                    jQuery('#canton_pdv').val(valornulo(PDVs.COUNC_DESC.toLowerCase()));
                    jQuery('#distrito_pdv').val(PDVs.CITYC_DESC.toLowerCase());
                    jQuery('#ciudad_pdv').val(PDVs.LAND1_DESC.toLowerCase());
                    jQuery('#barrio_pdv').val(valornulo(PDVs.AD_STRSPP3.toLowerCase()));
                    jQuery('#sena_pdv').val(valornulo(PDVs.AD_NAME_CO.toLowerCase()));
                    jQuery('#tel1_pdv').val(valornulo(PDVs.TELF1));
                    jQuery('#tel2_pdv').val(valornulo(PDVs.TELF2));
                    jQuery('#tel3_pdv').val(valornulo(PDVs.TELFX));
                    jQuery('#tipo_pdv').val(valornulo(PDVs.BRSCH_DESC));
                    jQuery('#ZLONG').val( PDVs.ZLONG);
                    jQuery('#ZLATITUD').val( PDVs.ZLATITUD);
                    if( PDVs.FECHA_1_VISITA != '0000-00-00'){
                        jQuery('#FECHA_1_VISITA').val( PDVs.FECHA_1_VISITA);
                    }else
                        jQuery('#FECHA_1_VISITA').val();
                    
                    jQuery('#FREC_VISITA > option[value="'+PDVs.FREC_VISITA+'"]').attr('selected', 'selected');
                    jQuery('#IND_TELEVENTA > option[value="'+PDVs.IND_TELEVENTA+'"]').attr('selected', 'selected');
                    jQuery('#TERCERIZADO > option[value="'+PDVs.TERCERIZADO+'"]').attr('selected', 'selected');
                    jQuery('#CLIENTE_AMPLIADO > option[value="'+PDVs.CLIENTE_AMPLIADO+'"]').attr('selected', 'selected');
                    jQuery('#LICENCIA_LICOR > option[value="'+PDVs.LICENCIA_LICOR+'"]').attr('selected', 'selected');
                    jQuery('#PAAT1 > option[value="'+Deudors.PAAT1+'"]').attr('selected', 'selected');
                    
                    if( jQuery('#LICENCIA_LICOR').val() == 'S' )
                        jQuery('#DKTXT_LICOR').removeAttr('disabled');
                    else
                        jQuery('#DKTXT_LICOR').attr('disabled', 'true');

                    //Codigos
                    jQuery.ajax({
                        type:       'GET',
                        url:        'ws/gac/codigos/consulta',
                        dataType:   'json',
                    })
                    .done(function(data){
                        jQuery('.rutas').remove();
                        jQuery('.negocios').remove();

                        jQuery.each( data.records.tipo_id, function( index,item ){
                            if( Deudors.PAAT1 == item.id )
                                jQuery('#PAAT1').append('<option class="rutas" selected value="'+item.id+'" style="text-transform:capitalize;">'+item.valor.toLowerCase()+'</option>');
                            else
                                jQuery('#PAAT1').append('<option class="rutas" value="'+item.id+'" style="text-transform:capitalize;">'+item.valor.toLowerCase()+'</option>');
                        });
                        jQuery.each( data.records.tipo_rutas, function( index,item ){
                            if( PDVs.BZIRK == item.id )
                                jQuery('#BZIRK').append('<option class="rutas" selected value="'+item.id+'" style="text-transform:capitalize;">'+item.id+' - '+item.valor.toLowerCase()+'</option>');
                            else
                                jQuery('#BZIRK').append('<option class="rutas" value="'+item.id+'" style="text-transform:capitalize;">'+item.id+' - '+item.valor.toLowerCase()+'</option>');
                        });
                        jQuery.each( data.records.tipo_negocio, function( index,item ){
                            if( PDVs.BRSCH == item.id )
                                jQuery('#BRSCH').append('<option class="rutas" selected value="'+item.id+'" style="text-transform:capitalize;">'+item.id+' - '+item.valor.toLowerCase()+'</option>');
                            else
                                jQuery('#BRSCH').append('<option class="rutas" value="'+item.id+'" style="text-transform:capitalize;">'+item.id+' - '+item.valor.toLowerCase()+'</option>');
                        });

                    }).fail(function(err){
                        console.log(err.messages);
                    });

                    //REGIO
                    jQuery.ajax({
                        type:       'GET',
                        url:        'ws/gac/provincia?pais='+jQuery('#pais').val(),
                        dataType:   'json',
                    })
                    .done(function(data){
                        if( data.result )
                        {
                            var contar = parseInt(data.records.length)-1;
                            var estado = 0;
                            jQuery.each( data.records, function( index,item )
                            {
                                if(item.BLAND!='000')
                                    if(PDVs.REGIO==item.BLAND){
                                        jQuery('#REGIO').append('<option class="provincias" selected value="'+item.BLAND+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                                        estado=1;
                                    }
                                    else
                                        jQuery('#REGIO').append('<option class="provincias" value="'+item.BLAND+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                                
                                if(contar == index && estado==0)
                                    jQuery('#REGIO').append('<option class="distritos" selected value="" style="text-transform:capitalize;">Sin Asignar</option>'); 

                            });
                        }
                        else
                            toastr['error'](data.message, 'Error');
                    }).fail(function(err){
                        console.log( err.message );
                        jQuery('#loader').fadeOut();
                    }).always( function(){
                        // console.log('Completo');
                    });

                    //COUNC
                    if( jQuery('#pais').val()=='CR' ){
                        jQuery.ajax({
                            type:       'GET',
                            url:        'ws/gac/cantones?pais='+jQuery('#pais').val()+'&provincia='+PDVs.REGIO,
                            dataType:   'json',
                        })
                        .done(function(data){
                            if( data.result )
                            {
                                var contar = parseInt(data.records.length)-1;
                                var estado = 0;
                                jQuery.each( data.records, function( index,item )
                                {
                                    if(item.BLAND!='000')
                                        if(PDVs.COUNC==item.COUNC){
                                            jQuery('#COUNC').append('<option class="cantones" selected value="'+item.COUNC+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                                            estado=1;
                                        }
                                        else
                                            jQuery('#COUNC').append('<option class="cantones" value="'+item.COUNC+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');

                                        if(contar == index && estado==0)
                                            jQuery('#COUNC').append('<option value="" class="distritos" selected style="text-transform:capitalize;">Sin Asignar</option>'); 
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

                    // CITYC
                    jQuery.ajax({
                        type:       'GET',
                        url:        'ws/gac/distritos?canton='+PDVs.COUNC+'&pais='+jQuery('#pais').val()+'&provincia='+PDVs.REGIO,
                        dataType:   'json',
                    }).done(function(data){
                        if( data.result )
                        {
                            var contar = parseInt(data.records.length)-1;
                            var estado = 0;
                            jQuery.each( data.records, function( index,item )
                            {
                                // console.log(PDVs.CITYC + '  **  '+item.CITYC );
                                if(item.CITYC!='000')
                                    if(PDVs.CITYC==item.CITYC){                                    
                                        // console.log('igual');
                                        jQuery('#CITYC').append('<option class="distritos" selected value="'+item.CITYC+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                                        estado=1;
                                    }
                                    else
                                        jQuery('#CITYC').append('<option class="distritos" value="'+item.CITYC+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');

                                if(contar == index && estado==0)
                                    jQuery('#CITYC').append('<option class="distritos" value="" selected style="text-transform:capitalize;">Sin Asignar</option>'); 
                            });
                        }
                        else
                            toastr['error'](data.message, 'Error');
                    }).fail(function(err){
                        console.log( err );
                    }).always( function(){
                        jQuery('#loader').fadeOut();
                    });
        
                       
                    
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
                    // jQuery('#alcoholico').text(' '+ parseFloat(Creditos.ALCOHOLICO).toFixed(2));
                    // jQuery('#no_alcoholico').text(' '+ parseFloat(Creditos.NO_ALCOHOLICO).toFixed(2));
                    // jQuery('#alimentos').text(' '+ parseFloat(Creditos.ALIMENTOS).toFixed(2));
                    // jQuery('#vinos_dest').text(' '+ parseFloat(Creditos.VINOS_DEST).toFixed(2));
                    // jQuery('#vinum').text(' '+ parseFloat(Creditos.VINUM).toFixed(2));
                    // jQuery('#artesanal').text(' '+ parseFloat(Creditos.ARTESANAL).toFixed(2));
                    // jQuery('#total').text(parseFloat((Creditos.ALCOHOLICO)+parseFloat(Creditos.NO_ALCOHOLICO)+parseFloat(Creditos.ALIMENTOS)+parseFloat(Creditos.VINOS_DEST)+parseFloat(Creditos.VINUM)+parseFloat(Creditos.ARTESANAL)).toFixed(2));
                    jQuery('#loader').fadeOut();
                }else{
                    jQuery('#modal-detalle').modal('hide')
                    toastr['success']('El formulario no cuenta con información', 'Éxito');
                    jQuery('#loader').fadeOut();
                }
            })
            .fail(function(err){
                // jQuery('#modal-detalle').modal('hide')
                console.log(err);
                toastr['error'](err.message, 'Error');
                jQuery('#loader').fadeOut();
            }); 
        }else{
            jQuery.ajax({
                type:       'POST',
                url:        'ws/gac/deudor/buscar/formulario',
                dataType:   'json',
                data:       { 'buscar':con },
            })
            .done(function(data){
                if( data.result ){
                    jQuery.each( data.records, function( index,value ){
                        switch( value.VTWEG ){
                            case '11':  limite='Ventas Alcoholico';     icon='beer';        break;
                            case '12':  limite='Ventas No Alcoholico';  icon='glass';       break;
                            case '13':  limite='Ventas Alimentos';      icon='cutlery';     break;
                            case '14':  limite='Ventas Craft';          icon='paperclip';   break;
                            case '15':  limite='Ventas Vinos y Dest';   icon='tint';        break;
                            case '16':  limite='Ventas Vinum';          icon='flask';       break;
                        }
                        // console.log( value );
                        jQuery('#limites_contenido').append('<div class="cont-limites">'+
                            '<div class="col-lg-1"></div>'+
                            '<div class="col-lg-4 row">'+
                                '<div class="input-group">'+
                                    '<span class="input-group-btn">'+
                                        '<button class="btn btn-default" type="button">  <i  class="fa fa-'+icon+'" style="font-size: 1.2em;text-transform:capitalize;"></i> '+limite+'</button>'+
                                    '</span>'+
                                '</div>'+
                            '</div>'+
                            '<div class="col-lg-3">'+
                                '<div class="input-group">'+
                                  '<span class="input-group-btn">'+
                                    '<button class="btn btn-default" type="button"> Limite actual</button>'+
                                    '</span>'+
                                    '<span type="text" class="form-control" placeholder="Search for..." style="text-transform:capitalize;">'+value.LIMITE_ANT+'</span>'+
                                '</div>'+
                            '</div>'+
                            '<div class="col-lg-3">'+
                                '<div class="input-group">'+
                                  '<span class="input-group-btn">'+
                                    '<button class="btn btn-default" type="button"> Limite a aprobar</button>'+
                                    '</span>'+
                                    '<span type="text" class="form-control" placeholder="Search for..." style="text-transform:capitalize;">'+value.LIMITE_NUEVO+'</span>'+
                                '</div>'+
                            '</div>'+
                            '<div class="col-lg-12"><hr></div>'+
                        '</div>');
                    });
                    

                    jQuery('#loader').fadeOut();
                }else{
                    toastr['error'](data.result, 'Error');
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
    }

    jQuery('#STKZN').on('change', function(e){
        e.preventDefault();
        if ( jQuery('#STKZN').val()=='X' ){
            jQuery('#contenido-juridico').hide();
        }else{
            jQuery('#contenido-juridico').show();
        }
    });

    jQuery('#REGIO').on('change', function(e){
        e.preventDefault();
        jQuery('#COUNC').attr('disabled', 'true');
        jQuery('#CITYC').attr('disabled', 'true');
        if( jQuery('#pais').val()=='CR' ){
            //COUNC
            jQuery.ajax({
                type:       'GET',
                url:        'ws/gac/cantones?pais='+jQuery('#pais').val()+'&provincia='+jQuery('#REGIO').val(),
                dataType:   'json',
            })
            .done(function(data){
                jQuery('#COUNC').removeAttr('disabled');
                jQuery('.cantones').remove();
                if( data.result ){
                    jQuery.each( data.records, function( index,item )
                    {
                        // console.log(item);
                        if(item.COUNC!='000')
                            jQuery('#COUNC').append('<option class="cantones" value="'+item.COUNC+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                    });
                }else
                    toastr['error'](data.message, 'Error');
            }).fail(function(err){
                console.log( err );
            }).always( function(){
                jQuery('#loader').fadeOut();
            });
        }else{
            // CITYC
            jQuery.ajax({
                type:       'GET',
                url:        'ws/gac/distritos?canton=&pais='+jQuery('#pais').val()+'&provincia='+jQuery('#REGIO').val(),
                dataType:   'json',
            }).done(function(data){
                jQuery('#CITYC').removeAttr('disabled');
                jQuery('.distritos').remove();
                if( data.result )
                {
                    jQuery.each( data.records, function( index,item )
                    {
                        if(item.CITYC!='000')
                            jQuery('#CITYC').append('<option class="distritos" value="'+item.CITYC+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');

                    });
                }
                else
                    toastr['error'](data.message, 'Error');
            }).fail(function(err){
                // console.log( err );
            }).always( function(){
                jQuery('#loader').fadeOut();
            });
        }
    });

    jQuery('#COUNC').on('change', function(e){
        // console.log('cambiaron los distritos '+jQuery('#COUNC').val());
        jQuery.ajax({
            type:       'GET',
            url:        'ws/gac/distritos?canton='+jQuery('#COUNC').val()+'&pais='+jQuery('#pais').val()+'&provincia='+jQuery('#REGIO').val(),
            dataType:   'json',
        }).done(function(data){
            jQuery('#CITYC').removeAttr('disabled');
            jQuery('.distritos').remove();
            if( data.result )
            {
                jQuery.each( data.records, function( index,item )
                {
                    if(item.CITYC!='000')
                        jQuery('#CITYC').append('<option class="distritos" value="'+item.CITYC+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                    

                });
            }
            else
                toastr['error'](data.message, 'Error');
        }).fail(function(err){
            console.log( err );
        }).always( function(){
            jQuery('#loader').fadeOut();
        });
    });

    // DEUD_REGIO
    //DEUD_COUNC
    //DEUD_CITYC

    jQuery('#DEUD_REGIO').on('change', function(e){
        e.preventDefault();
        jQuery('#DEUD_COUNC').attr('disabled', 'true');
        jQuery('#DEUD_CITYC').attr('disabled', 'true');
        if( jQuery('#pais').val()=='CR' ){
            //COUNC

            jQuery.ajax({
                type:       'GET',
                url:        'ws/gac/cantones?pais='+jQuery('#pais').val()+'&provincia='+jQuery('#DEUD_REGIO').val(),
                dataType:   'json',
            })
            .done(function(data){
                jQuery('#DEUD_COUNC').removeAttr('disabled');
                jQuery('.cantones').remove();
                if( data.result ){
                    jQuery.each( data.records, function( index,item )
                    {
                        if(item.COUNC!='000')
                            jQuery('#DEUD_COUNC').append('<option class="cantones" value="'+item.COUNC+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                    });
                }
                else
                    toastr['error'](data.message, 'Error');
            }).fail(function(err){
                // console.log( err );
            }).always( function(){
                jQuery('#loader').fadeOut();
            });            
        }else{
            // CITYC
            jQuery.ajax({
                type:       'GET',
                url:        'ws/gac/distritos?canton=&pais='+jQuery('#pais').val()+'&provincia='+jQuery('#DEUD_REGIO').val(),
                dataType:   'json',
            }).done(function(data){
                jQuery('#DEUD_CITYC').removeAttr('disabled');
                jQuery('.distritosd').remove();
                if( data.result )
                {
                    jQuery.each( data.records, function( index,item )
                    {
                        if(item.DEUD_CITYC!='000')
                            jQuery('#DEUD_CITYC').append('<option class="distritosd" value="'+item.CITYC+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                    });
                }
                else
                    toastr['error'](data.message, 'Error');
            }).fail(function(err){
                // console.log( err );
            }).always( function(){
                jQuery('#loader').fadeOut();
            });
        }
    });

    jQuery('#DEUD_COUNC').on('change', function(e){
        // console.log('cambiaron los distritos '+jQuery('#COUNC').val());
        jQuery.ajax({
            type:       'GET',
            url:        'ws/gac/distritos?canton='+jQuery('#DEUD_COUNC').val()+'&pais='+jQuery('#pais').val()+'&provincia='+jQuery('#DEUD_REGIO').val(),
            dataType:   'json',
        }).done(function(data){
            jQuery('#DEUD_CITYC').removeAttr('disabled');
            jQuery('.distritosd').remove();
            if( data.result )
            {

                jQuery.each( data.records, function( index,item )
                {
                    if(item.CITYC!='000')
                        jQuery('#DEUD_CITYC').append('<option class="distritosd" value="'+item.CITYC+'" style="text-transform:capitalize;">'+item.BEZEI.toLowerCase()+'</option>');
                });
            }
            else
                toastr['error'](data.message, 'Error');
        }).fail(function(err){
            console.log( err );
        }).always( function(){
            jQuery('#loader').fadeOut();
        });
    });

    function valornulo( valor ){
        if(valor == '0' || valor == '' /*|| valor == 'Undefined'*/)
            return '';
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