jQuery( document ).ready( function( $ ) 
{
    var pais_codigo = '';
    var pais_nombre = '';
    var ov=0;
    $('#IM_USUARIO').val(localStorage.EMPID);

    $('#btn-busqueda').on('click', busqueda);
    $('#tb-busqueda').on('click','.btn-detalle', detalles);
    $('#btn-cambiar').on('click', cambiar);
    $('#btn-busco').on('click', cambio);
    $('#btn-pdv-buscar').on('click', buscar_pdv);
    $('#REGIO').on('change', cambiar_region);
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
    
    cargarSociedad();
    cargarRutas();
    mascaras();

    $('#formalizacion_credito').on('click', formalizacionCredito);
    $('#btn-agregar-canal').on('click', agregarCanal);
    $("#tabla_canales").on('click', '.btn-eliminarcanal', eliminarCanal);
    $('#DKTXT').on('change', habilitarFotoPatente);
    $('#TAKLD').on('change', bloquearinputfoto)

    function cargarSociedad(){
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
                        $('.latitud').attr('placeholder','Máximo de 82.550000- y mínimo de 85.950000-');
                        $('.longitud').attr('placeholder','Máximos de 11.220000 y minímo de 8.040000');
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
                        $('#COUNC').remove();
                    break;

                    case 'SV':
                        $('.A').text('NIT');
                        $('.B').text('Departamento');
                        $('.C').text('Tipo de NIT');
                        $('.DD').hide();
                        $('.E').text('Municipio');
                        $('.F').text('Zona');
                        $('#COUNC').remove();
                    break;
                }
            }
            else
                toastr['error'](data.message, 'Error');
        }).fail(function(err){
            
        });
    }


    //Funciones
    function store(e){
        e.preventDefault();

        var longitud = $('#form-crear #ZLONG').val().split('.');
        var latitud = $('#form-crear #ZLATITUD').val().split('.');
        var grupoprecios = $('#form-crear #KONDA').val();
        var exento = $('#form-crear #TAKLD').val();
        var exentoFoto = $('#form-crear #FOTO_EXENTO').val();
        var exentovalido = false;

        if(exento == '0'  && exentoFoto != '')
            exentovalido = true;
        else {
            if(exento == '1'  && exentoFoto == '')
                exentovalido = true;
        }

        if( $('#form-crear').valid() ){

            if(grupoprecios != "0" && grupoprecios != "" && grupoprecios != null) {

                if (longitud.length == 2 && latitud.length == 2) {

                    var checkformalizacion = 1;
                    var arrayLimites = Array();

                    if($('#formalizacion_credito').is(':checked')){

                        checkformalizacion = 0;

                        $("#tabla_canales tbody > tr").each( function(){
                            
                            if($(this).is(":visible")){

                                checkformalizacion += 1;

                                var TIPO_NEGOCIO = $("#BRSCH").val();
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

                            var imagenPersoneria1 = '';
                            var imagenPersoneria2 = '';
                            var imagenId1 = '';
                            var imagenId2 = '';
                            var imagenPatente = '';
                            var imagenExento = '';
                            var limites = null;
                            
                            limites = JSON.stringify(arrayLimites);

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
                            if($('#form-crear #FOTO_DKTXT').val() != null && $('#form-crear #FOTO_DKTXT').val() != ""){
                                imagenPatente = subirArchivos($('#FOTO_DKTXT'));
                                IM_ARCHIVOS += "," + imagenPatente;
                            }
                            if($('#form-crear #FOTO_EXENTO').val() != null && $('#form-crear #FOTO_EXENTO').val() != ""){
                                imagenExento = subirArchivos($('#FOTO_EXENTO'));
                                IM_ARCHIVOS += "," + imagenExento;
                            }

                            $('#form-crear').append("<input type='hidden' name='TA_LIMITES' value='"+limites+"' /> ");
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
        else{
            toastr['error']('Debe de completar los campos obligatorios', 'Error');
            $('#loader').fadeOut();
        }
    }

    function busqueda( e ){
        
        e.preventDefault();
        codigo = $('#buscar').val();
        ruta = $('#ruta').val();
        if( $('#buscar').val())
        {
            $('#loader').show();
            $.ajax({
                type:       'POST',
                url:        'ws/gac/pdvs/buscar',
                // data:       { buscar:codigo, sociedad:localStorage.SOCIEDAD, empid:localStorage.EMPID, ruta:ruta},
                data:       { buscar:codigo, sociedad:'FDIS', empid:localStorage.EMPID, ruta:ruta},
                success: function( result )
                    {
                        if( result.result )
                        {
                            $("#tb-busqueda").dataTable().fnClearTable();
                            $.each( result.records.TA_INFO_PDV.item, function( index,value ){
                                var pais='';
                                var boton='';

                                if( value.DEUDOR )
                                    boton='<a data-placement="top" title="Desactivar permisos" class="toltip btn-detalle btn btn-primary btn-xs" href="#modal-detalle" data-toggle="modal" data-id="'+value.DEUDOR+'" data-cod="'+value.KUNNR+'" data-ruta="'+value.BZIRK+'"><i class="glyphicon glyphicon-pencil"></i> Ver</a>';
                                else
                                    boton='<a data-placement="top" disabled="true" title="Desactivar permisos" class="toltip btn-detalle btn btn-primary btn-xs" ><i class="glyphicon glyphicon-pencil"></i> Ver</a>';

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
                                // ---------------------------- Dirección>
                                var direccion='';
                                if( value.AD_NAME_CO.toLowerCase() )
                                    direccion=value.AD_NAME_CO.toLowerCase();

                                if( value.CITYC_DESC.toLowerCase() )
                                    if( direccion == '' )
                                        direccion = value.CITYC_DESC.toLowerCase();
                                    else
                                        direccion = direccion+', '+value.CITYC_DESC.toLowerCase();

                                if( value.REGIO_DESC.toLowerCase() )
                                    if( direccion == '' )
                                        direccion = value.REGIO_DESC.toLowerCase();
                                    else
                                        direccion = direccion+', '+value.REGIO_DESC.toLowerCase();

                                if( value.LAND1_DESC.toLowerCase() )
                                    if( direccion == '' )
                                        direccion = value.LAND1_DESC.toLowerCase();
                                    else
                                        direccion = direccion+', '+value.LAND1_DESC.toLowerCase();
                                // -------------------------------------->

                                $('#tb-busqueda').dataTable().fnAddData([
                                    value.KUNNR,
                                    '<span>'+value.NOMBRE_PDV.charAt(0).toUpperCase() + value.NOMBRE_PDV.toLowerCase().slice(1)+'</span>',
                                    value.BRSCH_DESC,
                                    patente,
                                    telefono,
                                    '<i style="text-transform:capitalize;">'+direccion+'</i>',
                                    boton,
                                ]);
                            });
                            // toastr['success'](result.message, 'Éxito');
                            $('#loader').fadeOut();
                        }
                        else
                        {
                            $("#tb-busqueda").dataTable().fnClearTable();
                            toastr['success'](result.message, ' Exito' );
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
            // $('#loader').fadeOut();
    }

    function cambio( e ){ // cambiar de deudor por código
        e.preventDefault();
        if( $('#buscar_cambiar').val() ){

            var Deudor=[];
            $('#loader').show();
            $.ajax({
                type:       'POST',
                url:        'ws/gac/deudores/buscar',
                dataType:   'json',
                // data:       { buscar:$('#buscar_cambiar').val(), sociedad: localStorage.SOCIEDAD, empid: localStorage.EMPID },
                data:       { buscar:$('#buscar_cambiar').val(), sociedad: 'FDIS', empid: localStorage.EMPID },
            })
            .done(function(data){
                if(data.result){
   
                    var Deudor=data.records.TA_INFO_DEUDOR.item[0];
                    $('#DEUDOR_CAMBIO').val(Deudor.KUNNR);
                    $('#KUNNR_SHOW').val(Deudor.KUNNR);
                    $('#ZTIPO_MOVPDV').val('E');
                    $('#AD_NAME1').text( valornulo(Deudor.AD_NAME1.toLowerCase()) );
                    toastr['success']('Deudor encontrado correctamente', 'Éxito');

                    infoCredito();

                }else
                    toastr['error']('El deudor no se encontró', 'Error');
            })
            .fail(function(err){
                toastr['error'](err.message, 'Error');
            })
            .always( function(){
                $('#loader').fadeOut();
            });
        }else{
            toastr['error']('No ha ingresado la cédula del deudor', ' Error' );
        }
    }

    function detalles ( e ){
        e.preventDefault();
        $('#form-crear')[0].reset();
        $('#loader').show();

        $('#FOTO_DKTXT').attr('disabled', true);

        var id = $(this).data('id');
        var cod = $(this).data('cod');
        var ruta = $(this).data('ruta');

        $.ajax({
            type:       'POST',
            url:        'ws/gac/pdvs/buscar',
            dataType:   'json',
            // data:       { buscar:codigo, sociedad:localStorage.SOCIEDAD, empid:localStorage.EMPID, ruta:ruta},
            data:       { buscar:codigo, sociedad:'FDIS', empid:localStorage.EMPID, ruta:ruta},
        })
        .done(function(data){
        	llenarPDV(data);
        })
        .fail(function(err){
            toastr['error'](err.message, 'Error');
        });
    }

    function buscar_pdv(e){// cambiar pdv por codigo
      e.preventDefault();
      if( !$('#pdv_codigo').val()== '' ){
        $('#loader').show();
        $('.tipo_negocio').remove();
        $('.tipo_ruta').remove();
        $('.provincias').remove();
        
        $.ajax({
            type:       'POST',
            url:        'ws/gac/pdvs/buscar',
            dataType:   'json',
            // data:       { buscar:codigo, sociedad:localStorage.SOCIEDAD, empid:localStorage.EMPID, ruta:ruta},
            data:       { buscar:codigo, sociedad:'FDIS', empid:localStorage.EMPID, ruta:ruta},
        })
        .done(function(Deudor){
         	llenarPDV(Deudor);
         })
        .fail(function(err){
            toastr['error']('El PDV no se ha encontrado', 'Éxito');
            $('#loader').fadeOut();
        })

      }else{
        toastr['error']('No ha ingresado el PDV', 'Error');
      }
    }

    function cambiar_region(e){
        e.preventDefault();
        $('#COUNC').attr( 'disabled','true');
        $('#CITYC').attr( 'disabled','true');

        if( $('#REGIO').val() && $('#pais_usuario').val()=='CR' ){
        	alert('costa rica');
            $('#loader').show();
            $('.canton').remove('');
            $('#COUNC').removeAttr( 'disabled','true');

            $.ajax({
	            type:       'GET',
	            url:        'ws/gac/cantones?pais='+'CR'+'&provincia='+$('#REGIO').val() ,
	            dataType:   'json',
	        }).done(function(data){
	        	// console.log(data);
	            if( data.result )
	            {
	                $.each( data.records, function( index,item )
	                {
	                    if(item.BLAND!='000')
	                        $('#COUNC').append('<option class="canton" value="'+item.COUNC+'" style="text-transform:capitalize;">'+item.BEZEI.charAt(0).toUpperCase() + item.BEZEI.toLowerCase().slice(1)+'</option>');
	                });
	            }
	            $('#loader').fadeOut();
	        }).fail(function(err){
	            // console.log( err );
	            $('#loader').fadeOut();
	        });

            $('#CITYC').attr( 'disabled','true');
        }
        else{
            $('#loader').show();
            if( $('#REGIO').val() && $('#pais_usuario').val()!='CR' ){
                $('.distritos').remove('');
                $('#CITYC').removeAttr( 'disabled','true');

                $.ajax({
		            type:       'GET',
		            url:        'ws/gac/distritos?pais='+$('#PAIS').val()+'&provincia='+$('#REGIO').val()+'&canton='+'',
		            dataType:   'json',
		        }).done(function(data){
		            if( data.result )
		            {
		                $.each( data.records, function( index,item )
		                {
		                    if(item.BLAND!='000')
		                        $('#CITYC').append('<option class="distritos" value="'+item.CITYC+'" style="text-transform:capitalize;">'+item.BEZEI.charAt(0).toUpperCase() + item.BEZEI.toLowerCase().slice(1)+'</option>');
		                });
		            }
		            else{
		                toastr['error'](data.message, 'Error');
		            }
                    $('#loader').fadeOut();
		        }).fail(function(err){
		            console.log( err );
		            $('#loader').fadeOut();
		        });
                
                $('#loader').fadeOut();
            }
            else{
                $('#COUNC').attr( 'disabled','true');
                $('#loader').fadeOut();
            }
        }
    };

     $('#COUNC').on('change', function(e){
        e.preventDefault();
        $('#loader').show();
        $('.distritos').remove('');

        if( $('#COUNC').val() ){
                $('#CITYC').removeAttr( 'disabled','true');
                $.ajax(
                {
                    type:       'GET',
                    url:        'ws/gac/distritos?canton='+$('#COUNC').val()+'&pais='+$('#pais_usuario').val()+'&provincia='+$('#REGIO').val(),
                    dataType:   'json',
                })
                .done(function(data)
                {
                    if( data.result )
                    {
                        $.each( data.records, function( index,item )
                        {
                            if(item.COUNC!='0000')
                                $('#CITYC').append('<option class="distritos" value="'+item.CITYC+'" style="text-transform:capitalize;"> '+item.BEZEI.toLowerCase()+'</option>');
                        });
                        $('#loader').fadeOut();
                    }
                    else{
                        toastr['error'](data.message, 'Error');
                        $('#loader').fadeOut();
                    }
                }).fail(function(err){
                    console.log( err );
                    $('#loader').fadeOut();
                }).always( function(){
                });

        }else{
            $('#loader').fadeOut();
        }
    });

    function valornulo( valor ){
        if(valor == '0' || valor == '' || valor ==' ' /*|| valor == 'Undefined'*/)
            return 'Sin asignar';
        else
            return valor;
    }

    function cambiar(e){
        e.preventDefault();
        $('#btn-busco').show();
    }

    $('#ORDEN_LUNES_B').on('change',function(e){   // $('#lunes').prop('checked')?console.log('Si lunes'):console.log('No lunes');
        $('#rol_lunes_B').val('');
        if( $('#ORDEN_LUNES_B').prop('checked') )
            $('#rol_lunes_B').val('1');
        else
            $('#rol_lunes_B').val('0');
    });

    $('#ORDEN_MARTES_B').on('change',function(e){  // $('#martes').prop('checked')?console.log('Si martes'):console.log('No martes');
        $('#rol_martes_B').val('');
        if( $('#ORDEN_MARTES_B').prop('checked') )
            $('#rol_martes_B').val('1');
        else
            $('#rol_martes_B').val('0');
    });

    $('#ORDEN_MIERCOLES_B').on('change',function(e){   // $('#miercoles').prop('checked')?console.log('Si miercoles'):console.log('No miercoles');
        $('#rol_miercoles_B').val('');
        if( $('#ORDEN_MIERCOLES_B').prop('checked') )
            $('#rol_miercoles_B').val('1');
        else
            $('#rol_miercoles_B').val('0');
    });

    $('#ORDEN_JUEVES_B').on('change',function(e){  // $('#jueves').prop('checked')?console.log('Si jueves'):console.log('No jueves');
        $('#rol_jueves_B').val('');
        if( $('#ORDEN_JUEVES_B').prop('checked') )
            $('#rol_jueves_B').val('1');
        else
            $('#rol_jueves_B').val('0');
    });

    $('#ORDEN_VIERNES_B').on('change',function(e){ // $('#viernes').prop('checked')?console.log('Si viernes'):console.log('No viernes');
        $('#rol_viernes_B').val('');
        if( $('#ORDEN_VIERNES_B').prop('checked') )
            $('#rol_viernes_B').val('1');
        else
            $('#rol_viernes_B').val('0');
    });

    $('#ORDEN_SABADO_B').on('change',function(e){  // $('#sabado').prop('checked')?console.log('Si sabado'):console.log('No sabado');
        $('#rol_sabado_B').val('');
        if( $('#ORDEN_SABADO_B').prop('checked') )
            $('#rol_sabado_B').val('1');
        else
            $('#rol_sabado_B').val('0');
    });

    function llenarPDV(data){

        limpiarValidacionesInput();

    	var PDVs = data.records.TA_INFO_PDV.item[0];
    	var pais = PDVs.LAND1;

        $('#fotos_fisico').addClass('hidden');
        $('#fotos_juridico').addClass('hidden');
        $('#VTWEG').attr('disabled',true);
        $('#FOTO_STCD1_1').attr('disabled', true);
        $('#FOTO_STCD1_2').attr('disabled', true);
        $('#FOTO_PAAT1_1').attr('disabled', true);
        $('#FOTO_PAAT1_2').attr('disabled', true);

        $('#KUNNR_SHOW').val(PDVs.DEUDOR)
        $('#KUNNRPDV').val(PDVs.KUNNR);
        $('#VKORGPDV').val(PDVs.VKORG);
        $('#VTWEGPDV').val(PDVs.VTWEG);
        $('#VWERK').val(PDVs.VWERK);
        $('#AD_NAME1').text(PDVs.AD_NAME1.toLowerCase())
        $('#NOMBRE_PDV').val(PDVs.NOMBRE_PDV.charAt(0).toUpperCase() + PDVs.NOMBRE_PDV.toLowerCase().slice(1));
        $('#KUNNRPDV').val(PDVs.KUNNR);
        $('#DKTXT').val(PDVs.DKTXT);
        $('#DKTXT_LICOR').val(PDVs.DKTXT_LICOR);
        $('#BRSCH_SHOW').val(PDVs.BRSCH_DESC);
        $('#BRSCH').val(PDVs.BRSCH);
        $('#REGIO_SHOW').val(PDVs.REGIO_DESC);
        $('#REGIO').val(PDVs.REGIO);
        $('#COUNC_SHOW').val(PDVs.COUNC_DESC);
        $('#COUNC').val(PDVs.COUNC);
        $('#CITYC_SHOW').val(PDVs.CITYC_DESC);
        $('#CITYC').val(PDVs.CITYC);
        $('#LAND1').val(PDVs.LAND1);
        $('#AD_STRSPP2').val(PDVs.AD_STRSPP2);
        $('#AD_STRSPP3').val(PDVs.AD_STRSPP3);
        $('#AD_NAME_CO').val(PDVs.AD_NAME_CO);
        $('#TELF1').val(PDVs.TELF1);
        $('#TELF2').val(PDVs.TELF2);
        $('#TELFX').val(PDVs.TELFX);
        $('#BZIRK option[value="'+PDVs.BZIRK+'"]').attr('selected', 'selected');
        $('#ZLATITUD').val(PDVs.ZLATITUD);
        $('#ZLONG').val(PDVs.ZLONG);
        $('#KDGRP option[value="'+PDVs.KDGRP+'"]').attr('selected', 'selected');
        $('#KONDA').val(PDVs.KONDA);
        $('#DEUDOR').val(PDVs.DEUDOR);
        $("#FREC_VISITA option[value='"+PDVs.FREC_VISITA+"']").attr("selected", "selected");
        $("#CLIENTE_AMPLIADO option[value='"+PDVs.CLIENTE_AMPLIADO+"']").attr("selected", "selected");
        $("#TERCERIZADO option[value='"+PDVs.TERCERIZADO+"']").attr("selected", "selected");
        $("#IND_TELEVENTA option[value='"+PDVs.IND_TELEVENTA+"']").attr("selected", "selected");
        $('#TAKLD option[value="'+PDVs.TAKLD+'"]').attr('selected', 'selected');

        if( PDVs.FECHA_1_VISITA && PDVs.FECHA_1_VISITA != '0000-00-00')
            $('#FECHA_1_VISITA').val(PDVs.FECHA_1_VISITA);

        if( PDVs.ORDEN_LUNES=='1' ){    $('#ORDEN_LUNES_B').attr('checked','checked');          $('#rol_lunes_B').val('1');}else{ $('#ORDEN_LUNES_B').removeAttr('checked');            $('#rol_lunes_B').val('0');}
        if( PDVs.ORDEN_MARTES=='1' ){   $('#ORDEN_MARTES_B').attr('checked','checked');     $('#rol_martes_B').val('1');}else{ $('#ORDEN_MARTES_B').removeAttr('checked');      $('#rol_martes_B').val('0');}
        if( PDVs.ORDEN_MIERCOLES=='1'){ $('#ORDEN_MIERCOLES_B').attr('checked','checked');      $('#rol_miercoles_B').val('1');}else{ $('#ORDEN_MIERCOLES_B').removeAttr('checked');    $('#rol_miercoles_B').val('0');}
        if( PDVs.ORDEN_JUEVES=='1' ){   $('#ORDEN_JUEVES_B').attr('checked','checked');     $('#rol_jueves_B').val('1');}else{ $('#ORDEN_JUEVES_B').removeAttr('checked');      $('#rol_jueves_B').val('0');}
        if( PDVs.ORDEN_VIERNES=='1' ){  $('#ORDEN_VIERNES_B').attr('checked','checked');        $('#rol_viernes_B').val('1');}else{ $('#ORDEN_VIERNES_B').removeAttr('checked');        $('#rol_viernes_B').val('0');}
        if( PDVs.ORDEN_SABADO=='1' ){   $('#ORDEN_SABADO_B').attr('checked','checked');     $('#rol_sabado_B').val('1');}else{ $('#ORDEN_SABADO_B').removeAttr('checked');      $('#rol_sabado_B').val('0');}

        if( PDVs.KONDA != "" ){
            pais    = PDVs.LAND1;
            ruta    = PDVs.BZIRK;
            negocio = PDVs.BRSCH;
            grupo   = PDVs.KONDA;

            descripcionGrupoPrecios(pais, ruta, negocio, grupo);
        }
        else
            $('#KONDA_SHOW').text('');

        $("#BZIRK").trigger( jQuery.Event("change") ); 
        $("#KDGRP").trigger( jQuery.Event("change") ); 

        if( !$.isEmptyObject(data.records.TA_LIMITES) ){

            $("#tabla_canales tbody").find('.fila').remove();

            $.each( data.records.TA_LIMITES.item, function( index,item ){
                        
                var canales = "<tr class='fila' data-vtweg='"+item.VTWEG+"'>"+
                                    "<td class='tiponegocio' style='visibility:hidden;''>"+item.TIPO_NEGOCIO+"</td>"+
                                    "<td class='vtext' style='width: 350px;'>"+item.DESCRIPCION+"</td>"+
                                    "<td><input type='number' class='form-control monto' style='width: 150px;' value='"+item.MONTO+"' disabled='true'/></td>"+
                                    "<td><a class='btn-eliminarcanal btn btn-danger btn-xs' style='margin-top: 7px;' disabled='true'><i class='fa fa-times-circle'></i></a></td>"+
                                "</tr>";

                $("#tabla_canales tbody").append(canales);

            });
        }else
            infoCredito();

        if( PDVs.STKZN == ''){
            $('#fotos_juridico').removeClass('hidden');
            $('#fotos_fisico').removeClass('hidden');
        }
        else{
            $('#fotos_fisico').removeClass('hidden');
        }

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
                    $('#KONDA_SHOW').text(' '+value.VTEXT);
            });

            $('#loader').fadeOut();

        }).fail(function(err){
            toastr['error'](err.message, 'Error');
        });
    }

    /*
    **FUNCION PARA CARGAR RUTAS
    **Se ejecuta al iniciar a vista
    */

    function cargarRutas(){

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
                $('#ruta').append($("<option />").val('').text('Seleccione una ruta'));
                
                $.each(data.records.tipo_rutas, function(index, value){
                    $('#ruta').append($("<option />").val(value.id).text(value.id+' - '+value.valor.toLowerCase()));
                    $('#BZIRK').append($("<option />").val(value.id).text(value.id+' - '+value.valor.toLowerCase()));
                });
                
                $('#ruta').select2({ });

                $('#KDGRP').find('option').remove().end();
                $('#KDGRP').append($("<option />").val('').text(''));
                $.each( data.records.tipo_grupos, function( index,item ){
                    $('#KDGRP').append('<option class="rutannvv" value="'+item.id+'" style="text-transform:capitalize;">'+item.id+' - '+item.valor.toLowerCase()+'</option>');
                });

                $('#VTWEG').find('option').remove().end();
                $('#VTWEG').append($("<option />").val('').text('Seleccione'));
                $.each( data.records.canales, function( index,item ){
                    $('#VTWEG').append('<option class="canales" value="'+item.id+'" style="text-transform:capitalize;">'+item.valor.toLowerCase()+'</option>');
                });
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

    function infoCredito(){

        $("#tabla_canales tbody").find('.fila').remove();        
        $("#VTWEG").find(".canales").show();

        var tiponegocio = $('#BRSCH').val();
        
        if( tiponegocio > 0 ){

            $.ajax({
                type:       'GET',
                url:        'ws/gac/infomontocredito',
                dataType:   'json',
                data:       {tipo_negocio:1111}
            })
            .done(function(data){

                if(data.result){

                    var options = $("#VTWEG").find("option");
                    $.each( data.records.TA_MONTOS.item, function( index,item ){
                        
                        options.each( function(){
                            if($(this).val() == item.VTWEG){
                                $(this).hide();
                            }
                        });

                        var canales = "<tr class='fila' data-vtweg='"+item.VTWEG+"'>"+
                                            "<td class='tiponegocio' style='visibility:hidden;''>"+item.TIPO_NEGOCIO+"</td>"+
                                            "<td class='vtext' style='width: 350px;'>"+item.DESCRIPCION+"</td>"+
                                            "<td><input type='number' class='form-control canalcantidad' min='0' style='width: 150px;' value='"+item.MONTO+"' disabled='true'/></td>"+
                                            "<td><a class='btn-eliminarcanal btn btn-danger btn-xs' style='margin-top: 7px;' disabled='true'><i class='fa fa-times-circle'></i></a></td>"+
                                        "</tr>";

                        $("#tabla_canales tbody").append(canales);

                    });

                    $("input.canalcantidad").keyup(inputCero);

                    sumaCanales();
                }
                else
                    toastr['error'](data.message, 'Error');
            })
            .fail(function(err){
                console.log( 'error' );
            })
            .always( function(){
            });
        }
    }

    function formalizacionCredito(){

        if($(this).is(':checked')){
            $('#VTWEG').removeAttr('disabled');
            $('#VTWEG option').show();
            $('#btn-agregar-canal').removeAttr('disabled');
            $('#tabla_canales tfoot > tr').find('.total').text('0');
            $('#tabla_canales td').find('a').removeAttr('disabled');
            $('#tabla_canales td').find('input').removeAttr('disabled');

            var options = $("#VTWEG").find("option");
            
            $('#tabla_canales tbody > tr').each( function(){

                var item = $(this).data('vtweg');
                
                options.each( function(){
                    if($(this).val() == item){
                        $(this).hide();
                    }
                });

                $(this).find('input.monto').keyup(inputCero);
            });

            if( $('#STKZN').val() == '' ){
                $('#FOTO_STCD1_1').removeAttr('disabled');
                $('#FOTO_STCD1_2').removeAttr('disabled');
                $('#FOTO_PAAT1_1').removeAttr('disabled');
                $('#FOTO_PAAT1_2').removeAttr('disabled');
            }
            else{
                $('#FOTO_PAAT1_1').removeAttr('disabled');
                $('#FOTO_PAAT1_2').removeAttr('disabled');   
            }

            sumaCanales();
        }
        else{
            $('#VTWEG').attr('disabled', true);
            $('#btn-agregar-canal').attr('disabled',true);
            $('#tabla_canales').find('.fila').show();
            $('#tabla_canales').find('.nuevo').remove();
            $('#tabla_canales td').find('input').attr('disabled',true);
            $('#tabla_canales td').find('a').attr('disabled',true);
            $('#tabla_canales tfoot > tr').find(".total").text('0');
            
            $('#FOTO_STCD1_1').val('');
            $('#FOTO_STCD1_2').val('');
            $('#FOTO_PAAT1_1').val('');
            $('#FOTO_PAAT1_2').val('');
            
            $('#FOTO_STCD1_1').attr('disabled',true);
            $('#FOTO_STCD1_2').attr('disabled',true);
            $('#FOTO_PAAT1_1').attr('disabled',true);
            $('#FOTO_PAAT1_2').attr('disabled',true);


            sumaCanales();
        }
    }

    function agregarCanal(){

        var VTWEG       = $('#VTWEG').val();
        var DESCRIPCION = $('#VTWEG option:selected').text();

        if(VTWEG > 0){

            var filacanal   = "<tr class='fila nuevo' data-vtweg='"+VTWEG+"'>"+
                                "<td class='tiponegocio' style='visibility:hidden;'></td>"+
                                "<td class='vtext' style='width: 350px; text-transform:capitalize;'>"+DESCRIPCION+"</td>"+
                                "<td><input class='form-control monto' type='number' class='form-control' min='0' style='width: 150px;' autofocus /></td>"+
                                "<td><a class='btn-eliminarcanal btn btn-danger btn-xs' style='margin-top: 7px;'><i class='fa fa-times-circle'></i></a></td>"+
                            "</tr>";

            $('#tabla_canales tbody').append(filacanal);


            $('#VTWEG option:selected').hide();
            $('#VTWEG option[value=""]').attr('selected', 'selected');

            $('input.monto').keyup(inputCero);
            $('input.monto').keyup(sumaCanales);
        }
        else
            toastr['error']('No se ha seleccionado el canal', 'Error');
    }

    function eliminarCanal(){

        var canaleliminar = $(this).parent().parent();
        var VTWEG = canaleliminar.data('vtweg');

        if(canaleliminar.hasClass('nuevo'))
            canaleliminar.remove();
        else
            canaleliminar.hide();

        $("#VTWEG").find("option").each( function(){

            if($(this).val() == VTWEG)
                $(this).show();

        });       

        sumaCanales();
    }

    function sumaCanales(){

        var total = 0;

        $('#tabla_canales tbody > tr').each( function(){
            
            if($(this).is(':visible')){
                var cantidad = parseInt($(this).find('input').val());

                total += cantidad;
            }
        }); 

        $('#tabla_canales tfoot').find('tr').remove();

        var filatotal  =   "<tr>"+
                                "<th></th>"+
                                "<th style='width: 350px;'><strong>Total: </strong></th>"+
                                "<th class='total' style='width: 150px;'><div style='text-align: center;'><strong>"+total+"</strong></div></th>"+
                            "</tr>";

        $('#tabla_canales tfoot').append(filatotal);
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

    function habilitarFotoPatente() {

        if($(this).val()!='')
            $('#FOTO_DKTXT').removeAttr('disabled');
        else{
            $('#FOTO_DKTXT').attr('disabled',true);
            $('#FOTO_DKTXT').val('');
        }
    }

    function bloquearinputfoto(){

        if($(this).val() == '0')
            $('#FOTO_EXENTO').removeAttr('disabled');
        else{
            $('#FOTO_EXENTO').attr('disabled', true);
            $('#FOTO_EXENTO').val('');
        }
    }

    function limpiarValidacionesInput(){
        $('#form-crear')[0].reset();
        $("#form-crear").validate().resetForm();

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

    $('#BZIRK').on('change', function(){
        var ruta = $(this).find('option:selected').text();
        $('#BZIRK_SHOW').val(ruta);
    });

    $('#KDGRP').on('change', function(){
        var grupoClientes = $(this).find('option:selected').text();
        $('#KDGRP_SHOW').val(grupoClientes);
    });

});
