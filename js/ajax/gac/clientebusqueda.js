jQuery( document ).ready( function( $ )
{
    var registro='';
    var codigo='';
    var codigos=[];
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
    
    $('#btn-busqueda').on('click', busqueda);
    $('#tb-busqueda').on('click','.btn-detalle', detalles);
    cargarRutas();

    function cargarRutas(){

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
                $('#ruta').append($("<option />").val('0').text('Seleccione una ruta'));
                
                $.each(data.records.tipo_rutas, function(index, value){
                    $('#ruta').append($("<option />").val(value.id).text(value.id+' - '+value.valor.toLowerCase()));
                    $('#BZIRK').append($("<option />").val(value.id).text(value.id+' - '+value.valor.toLowerCase()));
                });
                
                $('#ruta').select2({ });

                $('#PAAT1').find('option').remove().end();
                $.each( data.records.tipo_id, function( index,item ){
                    $('#PAAT1').append('<option class="tiposid" value="'+item.id+'" style="text-transform:capitalize;">'+item.valor.toLowerCase()+'</option>');
                });

                $('#KDGRP').find('option').remove().end();
                $.each( data.records.tipo_grupos, function( index,item ){
                    $('#KDGRP').append('<option class="tipocliente" value="'+item.id+'" style="text-transform:capitalize;">'+item.id+' - '+item.valor.toLowerCase()+'</option>');
                });
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

    function busqueda( e ){
        
        e.preventDefault();
        codigo = $('#buscar').val();
        ruta = $('#ruta').val();

        if( codigo )
        {
            $('#loader').show();

            $.ajax({
                type:       'GET',
                url:        'ws/gac/pdvs/buscar',
                // data:       { buscar:codigo, sociedad: localStorage.SOCIEDAD, empid: localStorage.EMPID, ruta:ruta},
                data:       { buscar:codigo, sociedad: 'FDIS', empid: localStorage.EMPID, ruta:ruta},
                success: function( result ){
                        if( result.result ){

                            $("#tb-busqueda").dataTable().fnClearTable();

                            $.each( result.records.TA_INFO_PDV.item, function( index,value ){

                                var boton='';
                                
                                if( value.DEUDOR )
                                    boton='<a data-placement="top" title="Ver detalles" class="toltip btn-detalle btn btn-primary btn-xs" href="#modal-detalle" data-toggle="modal" data-id="'+value.DEUDOR+'" data-cod="'+value.KUNNR+'"><i class="fa fa-eye"></i> Ver</a>';
                                else
                                    boton='<a data-placement="top" disabled="true" title="Desactivar permisos" class="toltip btn-detalle btn btn-primary btn-xs" ><i class="fa fa-eye"></i> Ver</a>';

                                var nombre= '';
                                
                                if( !value.AD_NAME_CO=='' )
                                    nombre=value.AD_NAME_CO;

                                if( !value.CITYC_DESC=='' )
                                    if( !nombre=='' )
                                        nombre= nombre+', '+value.CITYC_DESC.toLowerCase();
                                    else
                                        nombre= value.CITYC_DESC.toLowerCase();
                                if( !value.REGIO_DESC=='' )
                                    if( !nombre=='' )
                                        nombre= nombre+', '+value.REGIO_DESC.toLowerCase();
                                    else
                                        nombre= value.REGIO_DESC.toLowerCase();
                                if( !value.LAND1_DESC=='' )
                                    if( !nombre=='' )
                                        nombre= nombre+', '+value.LAND1_DESC.toLowerCase();
                                    else
                                        nombre= value.LAND1_DESC.toLowerCase();

                                $('#tb-busqueda').dataTable().fnAddData([
                                    value.KUNNR,
                                    '<span style="text-transform:capitalize;">'+(value.NOMBRE_PDV)+'</span>',
                                    '<i style="text-transform:capitalize;">'+nombre+'</i>',
                                    boton,
                                ]);
                            });

                            toastr['success']('Se generó la consulta exitosamente', 'Éxito');
                            $('#loader').fadeOut();
                        }
                        else
                        {
                            $("#tb-busqueda").dataTable().fnClearTable();
                            toastr['success'](result.message, ' Exito' );
                            $('#loader').fadeOut();
                        }
                    },
                error: function( result ){
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
        var Deudor=[];
        var PDV=[];
        $('#loader').show();
        var id = $(this).data('id');
        var cod = $(this).data('cod');
        $.ajax({
            type:       'POST',
            url:        'ws/gac/deudores/buscar',
            dataType:   'json',
            // data:       { buscar:id, sociedad: localStorage.SOCIEDAD, empid: localStorage.EMPID },
            data:       { buscar:id, sociedad: 'FDIS', empid: localStorage.EMPID },
        })
        .done(function(Deudor){

            var dataDeudor = Deudor.records.TA_INFO_DEUDOR.item[0];

            if( Deudor.result ){
                switch( dataDeudor.DEUD_LAND1 )
                {
                    case 'CR':
                        $('.A').text('Número de Identificación Fiscal');
                        $('.B').text('Provincia');
                        $('.C').text('Canton');
                        $('.D').text('Distrito');
                        $('.E').text('Barrio');
                    break;

                    case 'GT':
                        $('.A').text('NIT');
                        $('.B').text('Departamento');
                        $('.CC').hide('');
                        $('.D').text('Municipio');
                        $('.E').text('Zona');
                    break;
                }
                
                ruta=$('#ruta').val();

                $.ajax({
                    type:       'POST',
                    url:        'ws/gac/pdvs/buscar',
                    dataType:   'json',
                    // data:       { buscar:cod, sociedad: localStorage.SOCIEDAD, empid: localStorage.EMPID},
                    data:       { buscar:cod, sociedad: 'FDIS', ruta: ruta, empid: localStorage.EMPID},
                })
                .done(function(PDV){

                    var dataPdv=PDV.records.TA_INFO_PDV.item[0];
                    
                    $('#tipo').text(dataDeudor.STKZN!='' ? 'Persona Física' : 'Persona Jurídica');
                    
                    if ( dataDeudor.STKZN=='X' ){
                        $('#contenido-juridico_n').hide();
                        $('.P1').text(' Deudor');
                        $('.P2').text(' # Documento ID');
                        $('.P3').text(' Tipo doc ID');
                    }else{
                        $('#contenido-juridico_n').show();
                        $('.P1').text(' Sociedad');
                        $('.P2').text(' Cédula Jurídica');
                        $('.P3').text(' Tipo de doc. Jurídico');
                    }

                    $('#VTWEG_Z').val(dataDeudor.VTWEG);
                    $('#VKORG_C').val(dataDeudor.VKORG);
                    $('#KUNNR1').val(dataDeudor.KUNNR);
                    $('#KUNNR2').text(dataDeudor.KUNNR);
                    $('#DEUDOR').val(dataDeudor.KUNNR);
                    $('#STKZN_S').text(dataDeudor.STKZN == '' ? 'Persona Jurídica' : 'Persona Física');
                    $('#AD_NAME1_S').text(dataDeudor.STKZN == '' ? dataDeudor.AD_NAME1 : '');
                    $('#STCD1_S').text(dataDeudor.STKZN == '' ? dataDeudor.STCD1 : '');
                    $('#AD_TITLETX_S').text(dataDeudor.AD_TITLETX);
                    $('#AD_NAMEFIR_S').text(dataDeudor.AD_NAMEFIR );
                    $('#AD_NAMELAS_S').text(dataDeudor.AD_NAMELAS );
                    $('#AD_NAME2_P_S').text(dataDeudor.STKZN == '' ? dataDeudor.AD_NAME2_P : dataDeudor.STCD1);
                    $('#PAAT1 option[value="'+dataDeudor.PAAT1+'"]').attr('selected', 'selected');
                    $('#DEUD_REGIO_S').text(dataDeudor.DEUD_REGIO_DESC);
                    $('#DEUD_COUNC_S').text(dataDeudor.DEUD_COUNC_DESC);
                    $('#DEUD_CITYC_S').text(dataDeudor.DEUD_CITYC_DESC);
                    $('#DEUD_AD_STRSPP2_S').text(dataDeudor.DEUD_AD_STRSPP3);
                    $('#DEUD_AD_STRSPP3_S').text(dataDeudor.DEUD_AD_STRSPP3);
                    $('#DEUD_AD_NAME_CO_S').text(dataDeudor.DEUD_AD_NAME_CO);
                    $('#CONT_TELEF1_S').text(dataDeudor.CONT_TELEF1);
                    $('#CONT_TELEF2_S').text(dataDeudor.CONT_TELEF2);
                    $('#CONT_TELEF3_S').text(dataDeudor.CONT_TELEF3);
                    $('#AD_SMTPADR_S').text(dataDeudor.AD_SMTPADR);

                    $('#NOMBRE_PDV').text(dataPdv.NOMBRE_PDV.toLowerCase(),'0');
                    $('#KUNNRPDV2').text(dataPdv.KUNNR);
                    $('#DKTXT').text(dataPdv.DKTXT?dataPdv.DKTXT:'');
                    $('#DKTXT_LICOR').text(dataPdv.DKTXT_LICOR?dataPdv.DKTXT_LICOR:'');
                    $('#BRSCH').text(dataPdv.BRSCH_DESC+' - '+dataPdv.BRSCH_DESC);
                    $('#REGIO').text(dataPdv.REGIO_DESC.toLowerCase(),'0');
                    $('#COUNC').text(dataPdv.COUNC_DESC.toLowerCase(),'0');
                    $('#CITYC').text(dataPdv.CITYC_DESC.toLowerCase(),'0');
                    $('#AD_STRSPP2').text(dataPdv.AD_STRSPP2.toLowerCase(),'0');
                    $('#AD_STRSPP3').text(dataPdv.AD_STRSPP3.toLowerCase(),'0');
                    $('#AD_NAME_CO').text(dataPdv.AD_NAME_CO.toLowerCase(),'0');
                    $('#TELF1').text(dataPdv.TELF1,'0');
                    $('#TELF2').text(dataPdv.TELF2,'0');
                    $('#TELFX').text(dataPdv.TELFX,'0');
                    $('#TERCERIZADO').text(' '+dataPdv.TERCERIZADO=='S'?'Si':'No');
                    $('#IND_TELEVENTA').text(' '+dataPdv.IND_TELEVENTA=='S'?'Si':'No');
                    $('#ZLONG').text(dataPdv.ZLONG,'0');
                    $('#ZLATITUD').text(dataPdv.ZLATITUD,'0');
                    $('#FECHA_1_VISITA').text(dataPdv.FECHA_1_VISITA,'0');
                    $('#TAKLD').text(' '+PDV.records.TAKLD=='1'?'Si':'No');

                    $('#FREC_VISITA option[value="'+dataPdv.FREC_VISITA+'"]').attr('selected', 'selected');
                    $('#BZIRK option[value="'+dataPdv.BZIRK+'"]').attr('selected', 'selected');
                    $('#KDGRP option[value="'+dataPdv.KDGRP+'"]').attr('selected', 'selected');
                    
                    if( dataPdv.ORDEN_LUNES=='1' ){
                        $('#ORDEN_LUNES').attr('checked','checked');
                        $('#rol_lunes').val('1');
                    }else{
                        $('#ORDEN_LUNES').removeAttr('checked');
                        $('#rol_lunes').val('0');
                    }

                    if( dataPdv.ORDEN_MARTES=='1' ){
                        $('#ORDEN_MARTES').attr('checked','checked');
                        $('#rol_martes').val('1');
                    }else{
                        $('#ORDEN_MARTES').removeAttr('checked');
                        $('#rol_martes').val('0');
                    }

                    if( dataPdv.ORDEN_MIERCOLES=='1' ){
                        $('#ORDEN_MIERCOLES').attr('checked','checked');
                        $('#rol_miercoles').val('1');
                    }else{
                        $('#ORDEN_MIERCOLES').removeAttr('checked');
                        $('#rol_miercoles').val('0');
                    }

                    if( dataPdv.ORDEN_JUEVES=='1' ){
                        $('#ORDEN_JUEVES').attr('checked','checked');
                        $('#rol_jueves').val('1');
                    }else{
                        $('#ORDEN_JUEVES').removeAttr('checked');
                        $('#rol_jueves').val('0');
                    }

                    if( dataPdv.ORDEN_VIERNES=='1' ){
                        $('#ORDEN_VIERNES').attr('checked','checked');
                        $('#rol_viernes').val('1');
                    }else{
                        $('#ORDEN_VIERNES').removeAttr('checked');
                        $('#rol_viernes').val('0');
                    }

                    if( dataPdv.ORDEN_SABADO=='1' ){
                        $('#ORDEN_SABADO').attr('checked','checked');
                        $('#rol_sabado').val('1');
                    }else{
                        $('#ORDEN_SABADO').removeAttr('checked');
                        $('#rol_sabado').val('0');
                    }

                    $("#PAAT1").trigger( jQuery.Event("change") );
                    $("#BZIRK").trigger( jQuery.Event("change") );
                    $("#KDGRP").trigger( jQuery.Event("change") );
                    $("#FREC_VISITA").trigger( jQuery.Event("change") );

                    if( dataPdv.KONDA ){
                        pais    = dataPdv.LAND1;
                        ruta    = dataPdv.BZIRK;
                        negocio = dataPdv.BRSCH;
                        grupo   = dataPdv.KONDA;

                        descripcionGrupoPrecios(pais, ruta, negocio, grupo);
                    }

                    $("#tabla_canales tbody").find('.fila').remove();
                    $("#tabla_canales tfoot").find("tr").remove();
            
                    var total = 0;

                    $.each( PDV.records.TA_LIMITES.item, function( index,item ){
                        
                        total += parseFloat(item.MONTO);

                        var canales = "<tr class='fila' data-vtweg='"+item.VTWEG+"'>"+
                                            "<td class='tiponegocio' style='visibility:hidden;''>"+item.TIPO_NEGOCIO+"</td>"+
                                            "<td class='descripcion' style='width: 350px;'>"+item.DESCRIPCION+"</td>"+
                                            "<td><input type='text' class='form-control monto' style='width: 150px;' value='"+item.MONTO+"' disabled='true'/></td>"+
                                        "</tr>";

                        $("#tabla_canales tbody").append(canales);

                    });

                    var filatotal  =   "<tr>"+
                                            "<th></th>"+
                                            "<th style='width: 350px;'><strong>Total: </strong></th>"+
                                            "<th class='total' style='width: 150px;'><input type='number' class='form-control' style='width: 150px;' value='"+total+"' disabled='true'/></div></th>"+
                                        "</tr>";

                    $("#tabla_canales tfoot").append(filatotal);
                    
                })
                .fail(function(err){
                    $('#modal-detalle').modal('hide')
                    toastr['error'](err.message, 'Error');
                    $('#loader').fadeOut();
                })  
                .always( function(){
                    $('#loader').fadeOut();
                });
            }else{
                $('#modal-detalle').modal('hide')
                toastr['error']('No se encontró el Deudor para este PDV', 'Error');
                $('#loader').fadeOut();
            }


        })
        .fail(function(err){
            $('#modal-detalle').modal('hide')
            // console.log(err);
            toastr['error'](err.message, 'Error');
            $('#loader').fadeOut();
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
                    $('#KONDA').text(' '+value.VTEXT);
            });

        }).fail(function(err){
            toastr['error'](err.message, 'Error');
        });
    }

    $('#PAAT1').on('change', function(){
        var tipoid = $(this).find('option:selected').text();
        $('#PAAT1_S').text(tipoid);
    });

    $('#BZIRK').on('change', function(){
        var ruta = $(this).find('option:selected').text();
        $('#BZIRK_SHOW').text(ruta);
    });

    $('#KDGRP').on('change', function(){
        var tipocliente = $(this).find('option:selected').text();
        $('#KDGRP_SHOW').text(tipocliente);
    });

    $('#FREC_VISITA').on('change', function(){
        var frecuenciavisita = $(this).find('option:selected').text();
        $('#FREC_VISITA_SHOW').text(frecuenciavisita);
    });
});



