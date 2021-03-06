jQuery( document ).ready( function( e )
{
    jQuery('#loader').show();
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
    jQuery('#tb-busqueda').on('click','.btn-aprobar', function( e ){
        e.preventDefault();
        var con = jQuery(this).data('con');
        jQuery('.con').val(con);
    });

    jQuery('#tb-busqueda').on('click','.btn-rechazar', function( e ){
        e.preventDefault();
        var con = jQuery(this).data('con');
        jQuery('.con').val(con);
        jQuery('#mensaje').val('');
    });

    jQuery('#btn-aprobar').on('click', function( e ){
        e.preventDefault();
        jQuery('#loader').show();
        jQuery('#mensaje').val('');
        jQuery('#pernr').val(localStorage.EMPID);
        jQuery('#pernrf').val(localStorage.EMPID);
        // console.log( jQuery('#form-aprobar').serialize() );
        if( jQuery('#form-aprobar').valid() ){
            jQuery.ajax({
                type:       'POST',
                url:        'ws/gac/solicitudes/aprobar',
                dataType:   'json',
                data:       jQuery('#form-aprobar').serialize(),
            }).done(function(data){
                // console.log(data.records);
                if(data.result){
                    toastr['success'](data.message, 'Éxito');
                    jQuery('#modal-aprobar').modal('hide');    
                    BD_cargar();
                }else{
                    toastr['error'](data.message, 'Error');
                    jQuery('#loader').fadeOut();
                }
            }).fail(function(err){
                console.log(err);
                toastr['error']('Ocurrió un error en la conexion', 'Error');
            }).always( function(all){
                jQuery('#loader').fadeOut();
            });
        }
        else{
            toastr['error']('Hacen falta Datos en la solicitud', 'Error');
            jQuery('#loader').fadeOut();
        }
    });

    jQuery('#btn-rechazar').on('click', function( e ){
        e.preventDefault();
        jQuery('#loader').show();
        // console.log( jQuery('#form-rechazar').serialize() );
        if( !jQuery('#mensaje').val() ){
            toastr['warning']('No ha escrito el mensaje de rechazo', 'Cuidado');
            jQuery('#loader').fadeOut();
        }else{
            if( jQuery('#form-rechazar').valid() ){
                jQuery.ajax({
                    type:       'POST',
                    url:        'ws/gac/solicitudes/aprobar',
                    dataType:   'json',
                    data:       jQuery('#form-rechazar').serialize(),
                }).done(function(data){
                    if(data.result){
                        toastr['success'](data.message, 'Éxito');
                        jQuery('#modal-rechazar').modal('hide'); 
                        BD_cargar();
                    }else{
                        toastr['error'](data.message, 'Error');
                        jQuery('#loader').fadeOut();
                    }
                }).fail(function(err){
                    console.log(err);
                    toastr['error']('Ocurrió un error en la conexion', 'Error');
                }).always( function(all){
                    jQuery('#loader').fadeOut();
                });
            }
            else{
                toastr['error']('Hacen falta Datos en la solicitud', 'Error');
                jQuery('#loader').fadeOut();
            }
        }
    });

    function BD_cargar(){        
        window.tablaAreas.clear().draw();
        jQuery('#loader').show();
        jQuery.ajax(
        {
            url:        'ws/gac/buscar/sociedades?email='+localStorage.USUARIO,
            type:       'GET',
            dataType:   'json',
        })
        .done(function(data)
        { 
            if( data.result )
            {
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
                    break;

                    case 'GT':
                        jQuery('.A').text('NIT');
                        jQuery('.B').text('Departamento');
                        jQuery('.C').text('Tipo de NIT');
                        jQuery('.DD').hide();
                        jQuery('.E').text('Municipio');
                        jQuery('.F').text('Zona');
                        jQuery('#ZLATITUD').val('17');
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

                jQuery.ajax({
                    type:       'POST',
                    url:        'ws/gac/solicitudes',
                    dataType:   'json',
                    data:       { 'pais':jQuery('#pais').val(), pernr: localStorage.EMPID, email: localStorage.USUARIO},
                })
                .done(function(result){
                    if( result.result && result.records.TA_FORMULARIO){
                        jQuery('#loader').show();
                        // var contar= result.records.TA_FORMULARIO.item.length;
                        // var forms = result.records.TA_FORMULARIO.item;
                        console.log( result.records);
                        jQuery("#tb-busqueda").dataTable().fnClearTable();
                        jQuery.each( result.records.TA_FORMULARIO.item, function( index,value ){
                            // console.log(value.CONSEC);

                            jQuery.ajax({
                                type:       'POST',
                                url:        'ws/gac/deudor/buscar/formulario',
                                dataType:   'json',
                                data:       { 'buscar': value.CONSEC },
                            })
                            .done(function(data){                                
                                switch( jQuery.trim( data.records.EX_TIPO_MOV )){
                                    case 'A':   var mov= /*data.records.EX_TIPO_MOV+*/'<i>Nuevo PDV y Deudor </i>'; break;
                                    case 'B':   var mov= /*data.records.EX_TIPO_MOV+*/'<i>Nuevo PDV</i>'; break;//se cambio la letra con C
                                    case 'C':   var mov= /*data.records.EX_TIPO_MOV+*/'<i>Nuevo Deudor </i>'; break;//se cambio la letra con B
                                    case 'D':   var mov= /*data.records.EX_TIPO_MOV+*/'<i>Modificacion PDV</span> </i>'; break;//aca aparecen los Deudores modificados
                                    case 'E':   var mov= /*data.records.EX_TIPO_MOV+*/'<i>Modificar Deudor por otro </i>'; break;
                                    case 'F':   var mov= /*data.records.EX_TIPO_MOV+*/'<i>Modificar Deudor </i>';/*var mov='<i>Modificacion Deudor </i>';*/ break;
                                    default:    var mov= /*data.records.EX_TIPO_MOV+*/'<i>Solicitud de Crédito </i>'; break;
                                }

                                if(value.NOMBRE_PDV)
                                    var pdv = value.NOMBRE_PDV;
                                else
                                    var pdv='Sin Asignar';

                                var creditosBool=true;
                                var tipo='G';
                                var bandera ='';
                                if( data.records.EX_TIPO_MOV ){
                                    tipo = data.records.EX_TIPO_MOV;
                                    bandera = true;
                                }
                                else{
                                    if( data.records.length >= 0 ){
                                        bandera = true;
                                        creditosBool=false;
                                    }else{
                                        bandera = false;
                                    }
                                }

                                if( value.CONSEC == '0000045616' )
                                    console.log( value );

                                // if( tipo == 'G' && data,records)
                                
                                if( bandera ){
                                    counter1 = value.CONSEC;
                                    counter2 = pdv;
                                    counter3 = value.NOMBRE;                
                                    counter4 = value.FCREADO;
                                    counter5 = mov;
                                    if( creditosBool ){
                                        counter7 = '<a data-placement="top" title="Detalles de la solicitud" class="toltip btn-detalle btn btn-primary btn-xs" href="#modal-detalle" data-toggle="modal" data-tip="'+tipo+'" data-con="'+value.CONSEC+'" ><i class="fa fa-eye"></i></a>'+
                                                    ' <a data-placement="top" title="Aprobar la solicitud" class="toltip btn-aprobar btn btn-success btn-xs" href="#modal-aprobar" data-toggle="modal" data-con="'+value.CONSEC+'" ><i class="fa fa-check"></i></a>'+
                                                    ' <a data-placement="top" title="Rechazar la petición" class="toltip btn-rechazar btn btn-danger btn-xs" href="#modal-rechazar" data-toggle="modal" data-con="'+value.CONSEC+'" ><i class="fa fa-times"></i></a>';
                                    }else
                                        counter7 ='';
                                        
                                    window.tablaAreas.row.add([counter1,counter2,counter3,counter4,counter5,counter7]).draw(false);
                                }
                                   

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
                    jQuery('#loader').fadeOut();
                    toastr['error'](err.message, 'Error');
                }).always(function(data){
                    // jQuery('#loader').fadeOut();
                });

                //Estilos
                jQuery('.enabled').css( 'cursor', 'pointer' );
                jQuery('.creditosBool').css( 'cursor', 'pointer' );
            }
            else
                toastr['error'](data.message, 'Error');
        })
        .fail(function(err)
        {
            console.log(err);
            jQuery('#loader').fadeOut();
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
        jQuery('.cont-limites').remove();
        // console.log(con+' ** '+tip);
        jQuery('.con').val(con);
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

        if( tip != 'G' ){
            jQuery.ajax({
                type:       'POST',
                url:        'ws/gac/deudor/buscar/formulario',
                dataType:   'json',
                data:       { 'buscar':con },
            })
            .done(function(Deudor){
                if( Deudor.result ){
                    Deudors=Deudor.records.TA_INFO_DEUDOR.item;
                    PDVs=Deudor.records.TA_INFO_PDV.item;
                    Creditos=Deudor.records.EX_SOLICITUD_CREDITO;
                    // console.log( Deudors );
                    // console.log( PDVs );
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
                    
                    jQuery('#ZLONG').text(' '+PDVs.ZLONG);
                    jQuery('#ZLATITUD').text(' '+PDVs.ZLATITUD);

                    // console.log(Deudors.AD_NAME1+' ** '+Deudors.DEUD_REGIO_DESC);
                    // console.log(PDVs.NOMBRE_PDV+' ** '+PDVs.KUNNR);

                    console.log( Deudors );
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

                    if( PDVs.IND_TELEVENTA == 'S' )
                        jQuery('#televenta').text(' Si');
                    else
                        jQuery('#televenta').text(' No');
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
                    // jQuery('#alcoholico').text(' '+ parseFloat(Creditos.ALCOHOLICO).toFixed(2));
                    // jQuery('#no_alcoholico').text(' '+ parseFloat(Creditos.NO_ALCOHOLICO).toFixed(2));
                    // jQuery('#alimentos').text(' '+ parseFloat(Creditos.ALIMENTOS).toFixed(2));
                    // jQuery('#vinos_dest').text(' '+ parseFloat(Creditos.VINOS_DEST).toFixed(2));
                    // jQuery('#vinum').text(' '+ parseFloat(Creditos.VINUM).toFixed(2));
                    // jQuery('#artesanal').text(' '+ parseFloat(Creditos.ARTESANAL).toFixed(2));
                    // jQuery('#total').text(parseFloat((Creditos.ALCOHOLICO)+parseFloat(Creditos.NO_ALCOHOLICO)+parseFloat(Creditos.ALIMENTOS)+parseFloat(Creditos.VINOS_DEST)+parseFloat(Creditos.VINUM)+parseFloat(Creditos.ARTESANAL)).toFixed(2));
                    jQuery('#loader').fadeOut();
                }else{
                    // jQuery('#modal-detalle').modal('hide')
                    toastr['error']('No se encontró el Deudor para este PDV', 'Error');
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



