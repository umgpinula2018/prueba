jQuery( document ).ready( function( e )
{
    jQuery('#loader').fadeOut();
    var cont=0;
    var idnuevo=0;
    var creditos=[];
    var primero=[];
    var registro=[];
    var codigo='';
    var codigos=[];
    var nuevoCredito=0;
    var GuardarCambios=0;
    window.tablaAreas = jQuery("#tb-busqueda").DataTable({
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
    jQuery('#tb-busqueda').on('click','.btn-detalle', detalles);
    jQuery('#btn-canal').on('click',agregar_canal);

    jQuery('#btn-crear').on('click', function(e){
        e.preventDefault();
        var cambios=0;
        if( GuardarCambios !=1){
            if( nuevoCredito != 1 ){
                jQuery('#loader').show();
                var excento='';
                if( jQuery('#excento').val() =='Si' )
                    excento = 'X';

                jQuery('#loader').fadeOut();
                if( jQuery('#form-crear').valid() ){
                    jQuery.ajax({
                        type:       'POST',
                        url:        'ws/gac/credito/crear',
                        dataType:   'json',
                        data:       {json: JSON.stringify(creditos), pdv: jQuery('#pdv').val(), excento: excento, pernr: localStorage.EMPID},
                    }).done(function(data){
                        if(data.result){
                            registro = data.records;
                            toastr['success'](data.message, 'Éxito');
                            jQuery('#modal-detalle').modal('hide');    
                            jQuery('#loader').fadeOut();
                            // console.log('ingreso');
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
            }else{
                toastr['warning']('Aun hay pendiente un credito nuevo que no ha guardado', 'Cuidado');
            }
        }else{
            toastr['warning']('Hay limites modificados que aun no se han guardado', 'Cuidado');
        }
            
    });

    function busqueda( e ){
        e.preventDefault();
        codigo = jQuery('#buscar').val();
        if( jQuery('#buscar').val())
        {
            jQuery('#loader').show();
            jQuery.ajax({
                type:       'POST',
                url:        'ws/gac/pdvs/buscar',
                data:       { 'buscar':codigo, sociedad: localStorage.SOCIEDAD, email: localStorage.USUARIO, empid: localStorage.EMPID},
                success: function( result )
                    {
                        if( result.result )
                        {
                            jQuery("#tb-busqueda").dataTable().fnClearTable();
                            // console.log(result.records.TA_INFO_PDV);
                            jQuery.each( result.records.TA_INFO_PDV.item, function( index,value ){
                                var pais='';
                                var boton='';
                                
                                if( value.DEUDOR )
                                    boton='<a data-placement="top" title="Desactivar permisos" class="toltip btn-detalle btn btn-primary btn-xs" href="#modal-detalle" data-toggle="modal" data-id="'+value.DEUDOR+'" data-cod="'+value.KUNNR+'"><i class="fa fa-eye"></i> Ver</a>';
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

                                jQuery('#tb-busqueda').dataTable().fnAddData([
                                    value.KUNNR,
                                    '<span style="text-transform:capitalize;">'+(value.NOMBRE_PDV)+'</span>',
                                    '<i style="text-transform:capitalize;">'+nombre+'</i>',
                                    boton,
                                ]);
                            });

                            toastr['success']('Se generó la consulta exitosamente', 'Éxito');
                            jQuery('#loader').fadeOut();
                        }
                        else
                        {
                            jQuery("#tb-busqueda").dataTable().fnClearTable();
                            toastr['success'](result.message, ' Exito' );
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
            toastr['error']('Se necesita el codigo o nombre del cliente', 'Error');
            // jQuery('#loader').fadeOut();
    }

    function detalles ( e ){
        e.preventDefault();
        jQuery('.mostrar').show();
        jQuery('.ocultar').hide();
        jQuery('#loader').show();
        jQuery('#creditos_nuevo').remove();
        jQuery('.creditos_contenido').remove();
        nuevoCredito=0;
        var PDV=[];
        var Creditos=[];
        creditos=[];
        primero=[];
        var cod = jQuery(this).data('cod');
        jQuery('#pdv').val( cod );


        jQuery.ajax({
            type:       'POST',
            url:        'ws/gac/pdvs/buscar',
            dataType:   'json',
            data:       { 'buscar':cod, sociedad: localStorage.SOCIEDAD, email: localStorage.USUARIO, empid: localStorage.EMPID},
        }).done(function(PDV){
            PDVs=PDV.records.TA_INFO_PDV.item[0];
            Creditos=PDV.records.EX_SOLICITUD_CREDITO;
            //Información del PDV
                jQuery('#NOMBRE_PDV').val(PDVs.NOMBRE_PDV);
                jQuery('#AD_NAME1').val(PDVs.AD_NAME1);
            //Información del Cr´dito
                jQuery.ajax({
                    type:       'POST',
                    url:        'ws/gac/credito/listar',
                    dataType:   'json',
                    data:       { 'pdv':cod },
                }).done(function(data){
                    // console.log(data.records.TA_LIMITES.todos);
                    
                    primero=data.records.TA_LIMITES.todos;
                    jQuery.each( data.records.TA_LIMITES.todos, function( index,value ){
                        creditos.push(value);
                        if( index == ( parseInt(data.records.TA_LIMITES.todos.length) - 1 ) ){
                            contenido=creditos;
                            
                            llenar_creditos();
                        }
                    });

                }).fail(function(err){
                    console.log(err);
                    jQuery('#modal-detalle').modal('hide');
                    // toastr['error']('Ocurrió un error', 'Error');
                    jQuery('#loader').fadeOut();
                })  
                .always( function(){
                    // jQuery('#loader').fadeOut();
                });

                // jQuery('#ALCOHOLICO').val( parseFloat(Creditos.ALCOHOLICO).toFixed(2) );
                // jQuery('#NO_ALCOHOLICO').val( parseFloat(Creditos.NO_ALCOHOLICO).toFixed(2) );
                // jQuery('#ALIMENTOS').val( parseFloat(Creditos.ALIMENTOS).toFixed(2) );
                // jQuery('#VINOS_DEST').val( parseFloat(Creditos.VINOS_DEST).toFixed(2) );
                // jQuery('#VINUM').val( parseFloat(Creditos.VINUM).toFixed(2) );
                // jQuery('#ARTESANAL').val( parseFloat(Creditos.ARTESANAL).toFixed(2) );
                // jQuery('#total').text(parseFloat((Creditos.ALCOHOLICO)+parseFloat(Creditos.NO_ALCOHOLICO)+parseFloat(Creditos.ALIMENTOS)+parseFloat(Creditos.VINOS_DEST)+parseFloat(Creditos.VINUM)+parseFloat(Creditos.ARTESANAL)).toFixed(2))
        }).fail(function(err){
            jQuery('#modal-detalle').modal('hide');
            toastr['error'](err.message, 'Error');
            jQuery('#loader').fadeOut();
        })  
        .always( function(){
            // jQuery('#loader').fadeOut();
        });
    }

    function agregar_canal(e){
        e.preventDefault();
        var posible=0;
        jQuery.each( creditos, function( index,value ){
            if( parseFloat(value.LIMITE) == 0 )
                posible=1;
        });
        if(posible>0){
            if( nuevoCredito == 0){
                 jQuery('#contenido').append('<div id="creditos_nuevo">'+
                    '<div class="form-group col-md-12"><hr></div>'+
                    '<div class="form-group col-md-7" >'+
                        '<div>'+
                            '<div class="input-group">'+
                                '<span class="input-group-addon" id="sizing-addon1" >'+
                                    '<select id="nuevo_canales"></select>'+
                                '</span>'+
                                '<input id="nuevo_canales_VTWEG" maxlength="20" type="number" class="form-control col-md-12 LIMITE" placeholder="Sin Asignar" aria-describedby="sizing-addon1" style="text-align: right;" >'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="form-group col-md-5">'+
                        '<button class="btn-nuevo-confirmar btn btn-info btn" >'+
                            '<i class="fa fa-floppy-o"></i> Guardar'+
                        '</button> <button class="btn-nuevo-cancelar btn btn-danger btn" >'+
                            '<i class="fa fa-times"></i> Cancelar'+
                        '</button>'+
                    '</div>'+
                    '<div class="form-group col-md-12" ></div>'+
                '</div>');
                nuevoCredito=1;
                jQuery.each( creditos, function( index,value ){
                    if( parseFloat(value.LIMITE) == 0 )
                        jQuery('#nuevo_canales').append(''+
                            '<option value="'+value.VTWEG+'">'+value.VTEXT+'</option>'+
                        '');
                });

            }else{
                toastr['warning']('Hay un crédito nuevo pendiente por guardar', 'Cuidado');
            }
        }else{
            toastr['warning']('No hay créditos disponibles', 'Cuidado');
        }  
    }

    jQuery('#contenido').on('click', '.btn-nuevo-cancelar', function(e){
        e.preventDefault();
        jQuery('#creditos_nuevo').remove();
        nuevoCredito=0;
    });

    jQuery('#contenido').on('click', '.btn-nuevo-confirmar', function(e){
        e.preventDefault();
        if( jQuery('#nuevo_canales_VTWEG').val() ){
            var id= jQuery('#nuevo_canales').val();
            var monto= jQuery('#nuevo_canales_VTWEG').val();
            jQuery('#creditos_nuevo').remove();
            nuevoCredito=0;
            GuardarCambios=0;
            jQuery.each( creditos, function( index,value ){
                // console.log(value.VTWEG +' ** '+jQuery('#nuevo_canales').val());
                if( value.VTWEG == parseInt( id )){
                    value.LIMITE=monto;
                }
                if( index == (parseInt(creditos.length) - 1) )
                    llenar_creditos();
            });
        }else
            toastr['warning']('No ha ingresado un monto al nuevo crédito', 'Cuidado');
    });

    jQuery('#contenido').on('keyup', '.LIMITE', function(e){
        e.preventDefault();
        var id = jQuery(this).data('id');
        if( parseFloat(jQuery(this).val()) == parseFloat(jQuery('#'+id+'_VTWEGO').val()) ){
            jQuery('#guardaC'+id).hide();
            GuardarCambios=0;

        }else{
            jQuery('#guardaC'+id).show();
            GuardarCambios=1;
        }
    });

    jQuery('#contenido').on('click', '.btn-cambiosG', function(e){
        e.preventDefault();
        var id = jQuery(this).data('id');
        jQuery(this).hide();
        GuardarCambios=0;

        jQuery('#'+id+'_VTWEGO').val(jQuery('#'+id+'_cantidad').val());

        jQuery.each( creditos, function( index,value ){
            if( value.VTWEG == id ){
                value.LIMITE=jQuery('#'+id+'_cantidad').val();
            }
        });

        
    });

    function llenar_creditos(){
        jQuery('#loader').show();
        jQuery('.creditos_contenido').remove();
        jQuery('#creditos_nuevo').remove();
        nuevoCredito=0;
        total_creditos=0;
        jQuery.each( contenido, function( index,value ){
            if( parseFloat(value.LIMITE) > 0 ){
                total_creditos= parseFloat(total_creditos)+parseFloat(value.LIMITE);
                jQuery('#contenido').append('<div class="creditos_contenido" id="'+value.VTWEG+'">'+
                    '<div class="form-group col-md-6" >'+
                        '<div>'+
                            '<div class="input-group">'+
                                '<span class="input-group-addon" id="sizing-addon1" > <b>'+value.VTEXT+'</b> </span>'+
                                '<input type="hidden" class="VTWEG" value="'+value.VTWEG+'"/>'+
                                '<input maxlength="20" type="number" class="form-control col-md-12 LIMITE" placeholder="Sin Asignar" data-id="'+value.VTWEG+'" id="'+value.VTWEG+'_cantidad" aria-describedby="sizing-addon1" style="text-align: right;" value="'+parseFloat(value.LIMITE).toFixed(2)+'">'+
                                '<input maxlength="20" type="hidden" class="form-control col-md-12" placeholder="Sin Asignar" id="'+value.VTWEG+'_VTWEGO" aria-describedby="sizing-addon1" style="text-align: right;" value="'+parseFloat(value.LIMITE).toFixed(2)+'">'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="form-group col-md-2 eliminar" id="eliminar_'+value.VTWEG+'">'+
                        '<button class="btn-eliminar btn btn-danger btn" data-id="'+value.VTWEG+'" >'+
                            '<i class="glyphicon glyphicon-remove"></i>'+
                        '</button>'+
                        ' <button class="btn-cambiosG btn btn-primary btn" data-id="'+value.VTWEG+'" data-id="'+value.VTWEG+'" style="display:none;" id="guardaC'+value.VTWEG+'">'+
                            '<i class="fa fa-floppy-o"></i>'+
                        '</button>'+
                    '</div>'+
                    '<div class="form-group col-md-5 eliminar" style="display:none;" id="confirmar_'+value.VTWEG+'">'+
                        'Confirmar <button class="btn-eliminar-confirmar btn btn-success btn" data-id="'+value.VTWEG+'" >'+
                            '<i class="fa fa-check"></i> si'+
                        '</button> <button class="btn-eliminar-cancelar btn btn-danger btn" data-id="'+value.VTWEG+'" >'+
                            '<i class="fa fa-times"></i> no'+
                        '</button>'+
                    '</div>'+
                    '<div class="form-group col-md-12" ></div>'+
                '</div>');
            }

            if( index ==  (parseInt(contenido.length) - 1)){
                jQuery('#total_creditos').text( parseFloat(total_creditos).toFixed(2) );
                // console.log(total_creditos);
                jQuery('#loader').fadeOut();
            }
        });
    }

    jQuery('#contenido').on('click','.btn-eliminar',function(e){
        e.preventDefault();
        var id = jQuery(this).data('id');
        jQuery('#eliminar_'+id).hide();
        jQuery('#confirmar_'+id).show();
    });

    jQuery('#contenido').on('click','.btn-eliminar-cancelar ',function(e){
        e.preventDefault();
        var id = jQuery(this).data('id');
        jQuery('#eliminar_'+id).show();
        jQuery('#confirmar_'+id).hide();
    });

    jQuery('#contenido').on('click','.btn-eliminar-confirmar',function(e){
        e.preventDefault();
        var id = jQuery(this).data('id');
        jQuery.each( creditos, function( index,value ){
            if( value.VTWEG == id ){
                value.LIMITE='0.0';
            }
            if( index == (parseInt(creditos.length) - 1) )
                llenar_creditos();
        });
    });


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

    jQuery("#CN_monto_").on({
        "focus": function (event) {
            jQuery(event.target).select();
        },
        "keyup": function (event) {
            jQuery(event.target).val(function (index, value ) {
                return value.replace(/\D/g, "")
                            .replace(/([0-9])([0-9]{2})$/, '$1.$2')
                            .replace(/\B(?=(\d{15})+(?!\d)\.?)/g, ",");
            });
        }
    });

    function agregar(){
        var contenido = registro.nombre;
        // console.log(contenido);
        
    }
});



