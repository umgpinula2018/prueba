                        //Variables globales
var uid_usuario = '';
var json_validacion = new Array();
var json_movimientos = new Array();
var json_adelantos = new Array();
var liquidacion_id = 0;
var ceco_validacion=true;
var orden_validacion=true;
var modificar=0;
var array_gastos = new Array();
var array = new Array();
var validacion_adelantos=1;
jQuery( document ).ready( function( $ )
{    
    // Properties
    window.tablaAreas = $("#tlb-registros").DataTable({
        "columnDefs": [{
                "targets": [ 9 ],
                "visible": false,
                "searchable": false
            }
        ],
        "order": [[ 8, "desc" ]],
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

    $('.input-date-picker').datepicker({
        format: 'dd-mm-yyyy',
        orientation: "bottom",
        daysOfWeekDisabled: "7",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true,
    });

    $('.input-date-picker-free').datepicker({
        format: 'dd-mm-yyyy',
        orientation: "bottom",
        daysOfWeekDisabled: "7",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true
    });

    $('.input-date-picker-free-g').datepicker({
        format: 'dd-mm-yyyy',
        orientation: "bottom",
        daysOfWeekDisabled: "7",
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true
    });

    //Initial functions
    localStorage.removeItem('MOVIMIENTOS');
    uid_usuario = localStorage.USUARIO.toUpperCase();
    cargarDatosUsuario(uid_usuario);
    delegates(uid_usuario);
    loadTable(uid_usuario);
    addRubros();

    // // Events
    $('#monedaN').on('change', changeMoney);
    $('#usuarios').on('change', changeUser);
    $('#btn-open').on('click', loadData);
    $('#btn-crear').on('click', saveLiquidation);
    $('#add-data').on('click', addData);
    $('#tipoN').on('change', changeType);
    $('#tlb-registros').on('click','.btn-agregar', addLiquidationDetail);
    $('#btn-volver').on('click', backData);
    $('#btn-volver2').on('click', backData);
    $('#btn-buscar-cedula').on('click', searchCedula);
    // $('#btn-buscar-ceco').on('click', searchCeco)
    // $('#btn-buscar-orden').on('click', searchOrden)
    $('#ceco').on('keyup', changeCeco);
    $('#orden').on('keyup', changeOrden);
    $('#btn-crear-gasto').on('click', saveExpense);
    $('#tlb-registros').on('click','a.btn-enviar-liq', prepareLiquidation);
    $('#tlb-registros').on('click','a.btn-eliminar', prepareLiquidationDelete);
    $('#btn-enviar-liquidacion').on('click', sendLiquidation);
    $('#btn-eliminar-liquidacion').on('click', deleteLiquidation);
    $('#btn-eliminar-gasto').on('click', deleteExpense);
    $('#select-mov').on('click', addExpense);
    //Functions
  function cargarDatosUsuario(usuario)
{   
    //console.log(usuario);
    jQuery.ajax({
        url:        'ws/sap/data/showmember',
        type:       'GET',
        dataType:   'json',
        async:      false,
        data:       {user:usuario}
    })
    .done(function (response) {
        if (response.result) {
            // jQuery('#tarjeta_user').val(response.records.MONIBYTE);
            localStorage.setItem('TRAVEL_DATOS_USUARIO', JSON.stringify(response.records));
            cargarDatosJefe(usuario);

        } else {
            console.log(response.message);
        }   
    })
}

function cargarDatosJefe(usuario)
{
    jQuery.ajax({
        url:        'ws/concursos/perfil',
        type:       'GET',
        dataType:   'json',
        data:       { user:usuario }
    })
    .done(function (response) {
        if (response.result) {
            localStorage.setItem('TRAVEL_DATOS_JEFE', JSON.stringify(response.records.jefe));
        } else {
            console.log(response.message);
        }   
    })
}
//
    function loadTable (usuario)
    {  
        console.log("llego");
        var moneda = '';
        var datos_usuario = JSON.parse(localStorage.TRAVEL_DATOS_USUARIO);
        window.tablaAreas.clear().draw();
        $('#loader').show();
        $.ajax({
            url:        'ws/travel/liquidacion/historial/guardadas',
            type:       'GET',
            dataType:   'json',
            data:       {usuario_email:usuario,tarjeta:datos_usuario.MONIBYTE}
        })
        .done(function(data){
            if (data.result) {
                $.each( data.records, function(index,value) { 
                    //console.log(value);
                    if (value.moneda == 0) {
                        moneda = "$";
                    } else if(value.moneda == 1) {
                        moneda = '₡';
                    }else{
                        moneda = 'Q';
                    }
                    counter1 = value.correlativo;
                    counter2 = value.nombre_creo;
                    var dias = value.dias;
                    if (value.dias == 0) {
                        counter3 = 'No hay información';
                    } else {
                    	counter3 = value.dias+' días';
                        // counter3 = value.fecha_vencimiento;
                    }       
                    counter4 = value.justificacion;
                    counter5 = value.fecha_finalizacion;
                    counter6 = value.fecha_liquidacion;
                    if(value.tarjeta)
                        counter7 = '<span style="font-size: 0.9em;" class="label label-default">Monibyte</span>';
                    else
                        counter7 = '<span style="font-size: 0.9em;" class="label label-default">No Monibyte</span>';

                    counter8 = moneda+'. '+value.monto;
                    if( value.dias == 'Vencida' )
                        var disable =' disabled="true" ';
                    else
                        var disable='';
                    if (value.tarjeta == "") {
                         counter9 = '<td>'+
                                    '<a href="#modal-agregar" role="button" '+disable+' data-toggle="modal"  title="Agregar gastos a la liquidación" style="margin-left: 5px;" class="btn btn-info btn-xs btn-agregar" data-toggle="modal" data-id="'+value.id+'"><i class="fa fa-plus "></i></a>'+
                                    '<a href="#modal-enviar" role="button" '+disable+' data-toggle="modal"  title="Enviar la liquidación" style="margin-left: 5px;" class="btn btn-success btn-xs btn-enviar-liq" data-toggle="modal" data-id="'+value.id+'" data-cor="'+value.correlativo+'"><i class="fa fa-arrow-right "></i></a>'+
                                    '<a href="#modal-eliminar" role="button" '+disable+' data-toggle="modal"  title="Eliminar liquidación" style="margin-left: 5px;" class="btn btn-danger btn-xs btn-eliminar" data-toggle="modal" data-id="'+value.id+'"><i class="fa fa-trash "></i></a>'+
                               '</td>';
                               }
                   else{
                         counter9 = '<td>'+
                                    '<a href="#modal-agregar" role="button" '+disable+' data-toggle="modal"  title="Agregar gastos a la liquidación" style="margin-left: 5px;" class="btn btn-info btn-xs btn-agregar" data-toggle="modal" data-id="'+value.id+'"><i class="fa fa-plus "></i></a>'+
                                    '<a href="#modal-enviar" role="button" '+disable+' data-toggle="modal"  title="Enviar la liquidación" style="margin-left: 5px;" class="btn btn-success btn-xs btn-enviar-liq" data-toggle="modal" data-id="'+value.id+'" data-cor="'+value.correlativo+'"><i class="fa fa-arrow-right "></i></a>'+
                               '</td>'; 
                   }
                   
                    counter10 = value.created_at;
                    window.tablaAreas.row.add([counter1,counter2,counter3,counter4,counter5,counter6,counter7,counter8,counter9,counter10]).draw(false);
                });
                //console.log(data.records);
                $('.enabled').css( 'cursor', 'pointer' );
                $('.disabled').css( 'cursor', 'pointer' );
            }
            else
                toastr['error'](data.message, 'Error');
        }).fail(function(err){
            console.log(err);
        }).always( function(){
            $("#loader").fadeOut();
        });     
    }

    function changeUser ()
    {
        uid_usuario = $('#usuarios').val().toUpperCase();
        cargarDatosUsuario(uid_usuario);
        loadTable(uid_usuario);
    }

    function delegates( email )
    { 
        $.ajax({
            type:       'GET',
            url:        'ws/travel/liquidaciones/permisos?email='+email,
            dataType:   'json',
        })
        .done(function(data){
            if (data.result) {
                var bandera = 0;
                $('.usuarios').remove();
                $('#usuarios').append('<option class="usuarios" selected="selected" value="'+localStorage.USUARIO+'">'+JSON.parse(localStorage.TRAVEL_DATOS_USUARIO).NOMBRE+'</option>');
                $.each(data.records, function(index, valor) {
                    if (valor.solicitud == 'true') {
                        bandera = 1;
                        $('#usuarios').append('<option class="usuarios" value="'+valor.email_jefe+'">'+valor.nombre_jefe+'</option>');
                    }
                });
            } else{
                toastr['error'](data.message, 'Error');
            }
        }).always( function(){ });  
    }

    function loadData ()
    {
        var datos_usuario = JSON.parse(localStorage.TRAVEL_DATOS_USUARIO);
        if(datos_usuario.PAIS == 'GT')
        {
            $('#colones').hide();
            $('#quetzales').show();
        }
        else if(datos_usuario.PAIS == 'CR')
        {
            $('#quetzales').hide();
            $('#colones').show();
        }
        if (datos_usuario.MONIBYTE === '') {
            $('#head-detail').text('Detalle de adelantos de efectivo');
            $('#add-data').text(' Agregar adelanto');
        } else {
            $('#head-detail').text('Detalle de movimientos');
            $('#add-data').text(' Agregar movimientos');
        }  
    }

    function addData () 
    {
        $('#loader').show();
        $('#detail-data').html('');
        var datos_usuario = JSON.parse(localStorage.TRAVEL_DATOS_USUARIO);
        if (datos_usuario.MONIBYTE === '') {
            $.ajax({
                type:       'GET',
                url:        'ws/travel/adelantos/aprobados',
                dataType:   'json',
                data:       {usuario_creo: uid_usuario,moneda:$('#monedaN').val()},
            })
            .done(function(response) {
                if (response.result) {
                    if (response.records.length > 0) {
                        array = new Array();
                        $.each(response.records, function(index, value) {
                            moneda = '';
                            if (value.tipo_moneda == 0) 
                                moneda = '$. ';
                            else if (value.tipo_moneda == 1)
                                moneda = '₡. ';
                            else
                                moneda = 'Q. ';

                            var html = '<div class="row">'+
                                            '<div class="col-sm-5">'+
                                                '<div class="input-group">'+
                                                    '<span class="input-group-addon  btn-info">Correlativo</span>'+
                                                    '<input type="text" class="form-control" disabled value="'+value.correlativo+'"/>'+
                                                '</div>'+
                                            '</div>'+
                                            '<div class="col-sm-5">'+
                                                '<div class="input-group">'+
                                                    '<span class="input-group-addon  btn-info">Justificación</span>'+
                                                    '<input type="text" class="form-control" disabled value="'+value.justificacion+'"/>'+
                                                '</div>'+
                                                '<br>'+
                                            '</div>'+
                                            '<div class="col-sm-2">'+
                                                '<div class="input-group">'+
                                                    '<input id="'+value.id+'" type="checkbox" data-id="'+value.id+'" class="check-expense adelantos_check"/>'+
                                                    '<label for="'+value.id+'" style="font-size:14px;font-family: Tahoma" class="checkbox">Seleccionar'+
                                                '</div>'+
                                            '</div>'+
                                            '<div class="col-sm-5">'+
                                                '<div class="input-group">'+
                                                    '<span class="input-group-addon  btn-info">Monto</span>'+
                                                    '<input type="text" class="form-control" disabled value="'+moneda+value.monto+'"/>'+
                                                '</div>'+
                                            '</div>'+
                                            '<div class="col-sm-5">'+
                                                '<div class="input-group">'+
                                                    '<span class="input-group-addon  btn-info">Fecha entrega</span>'+
                                                    '<input type="text" class="form-control" disabled value="'+value.fecha_entrega+'"/>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+
                                        '<hr>';
                            $('#detail-data').append(html);
                             // array.push({ id: value.id});
                        });
                        // json_adelantos = JSON.stringify(array);
                    } else {
                        toastr['warning']('No tiene adelantos realizados', 'Espere');
                        validacion_adelantos=1;
                    }
                } else {
                    toastr['error'](response.message, 'Error');
                }
            })
            .always( function () {
                $('#loader').hide();
            });
        } else {
            $.ajax({
                type:       'GET',
                url:        'ws/travel/monibyte/tarjeta/consultar',
                dataType:   'json',
                data:       {tarjeta: datos_usuario.MONIBYTE, moneda: $('#monedaN').val()},
            })
            .done(function(response) {
                if (response.result) {
                    array = new Array();
                    if (response.records.length == 0) {
                         toastr['warning']('No tiene movimientos cargados', 'Espere');
                    } else {
                        if (response.records.monibyte.length > 0) {
                            $.each(response.records.monibyte, function(index, value) {
                                var monto = value.monto_inter == 0 ? value.monto_local : value.monto_inter;
                                var html = '<div class="row">'+
                                                '<div class="col-sm-6">'+
                                                    '<div class="input-group">'+
                                                        '<span class="input-group-addon  btn-info">Fecha</span>'+
                                                        '<input type="text" class="form-control" disabled value="'+value.fecha+'"/>'+
                                                    '</div>'+
                                                '</div>'+
                                                '<div class="col-sm-6">'+
                                                    '<div class="input-group">'+
                                                        '<span class="input-group-addon  btn-info">Monto</span>'+
                                                        '<input type="text" class="form-control" disabled value="'+value.moneda_simbolo+' '+monto+'"/>'+
                                                    '</div>'+
                                                    '<br>'+
                                                '</div>'+
                                                '<div class="col-sm-6">'+
                                                    '<div class="input-group">'+
                                                        '<span class="input-group-addon  btn-info">Establecimiento</span>'+
                                                        '<input type="text" class="form-control" disabled value="'+value.detalles+'"/>'+
                                                    '</div>'+
                                                '</div>'+
                                                '<div class="col-sm-6">'+
                                                    '<div class="input-group">'+
                                                        '<span class="input-group-addon  btn-info">Tipo</span>'+
                                                        '<input type="text" class="form-control" disabled value="'+value.rubro.rubro_nombre+'"/>'+
                                                    '</div>'+
                                                '</div>'+
                                            '</div>'+
                                            '<hr>';
                                $('#detail-data').append(html);
                                array.push({ id: value.id});
                            });
                            json_movimientos = JSON.stringify(array);
                        } else {
                            toastr['warning']('No tiene movimientos cargados', 'Espere');
                        }
                    }
                } else {
                    toastr['error'](response.message, 'Error');
                }
            })
            .always( function () {
                $('#loader').hide();
            });
        }
    }

    function saveLiquidation ()
    {
        var datos_usuario = JSON.parse(localStorage.TRAVEL_DATOS_USUARIO);
        if (datos_usuario.MONIBYTE.length == 0 ) {
             $.each($('#detail-data > div.row').find('input.check-expense'), function (index, value) {
                if ($(this).is(':checked')) {
                    array.push({ id: value.id});
                }
            });    
        } else{
            array = [];
        } 
        json_adelantos = array;
        
        var datos_jefe = JSON.parse(localStorage.TRAVEL_DATOS_JEFE);
        if (validacion_adelantos==1) {
            if ( datos_usuario.MONIBYTE == '' ) {
                json_validacion=json_adelantos;
            } else {
                json_validacion=json_movimientos;
            }
            if (json_validacion.length > 0 || datos_usuario.MONIBYTE == '') {
                if (json_movimientos ) {
                    var data = {
                        tarjeta: datos_usuario.MONIBYTE,
                        fecha_finalizacion: $('#fecha_finalizacionN').val(),
                        fecha_liquidacion: $('#fecha_liquidacionN').val(),
                        sociedad: datos_usuario.SOCIEDAD,
                        justificacion: $('#justificacionN').val(),
                        tipo: $('#tipoN').val(),
                        usuario_jefe: datos_jefe.EMAIL,
                        nombre_jefe: datos_jefe.ENAME,
                        usuario_creo: uid_usuario,
                        nombre_creo: datos_usuario.NOMBRE,
                        moneda: $('#monedaN').val(),
                        empid: datos_usuario.EMPID,
                        pais: datos_usuario.PAIS,
                        acreedor: datos_usuario.ACREEDOR,
                        uid_jefe: datos_jefe.UNAME,
                        correo_solicitante: datos_usuario.CORREO,
                        json_adelanto: JSON.stringify(json_adelantos),
                        json_movimientos: json_movimientos,
                    };   
                   // console.log(data);
                    if ($('#frm-nuevo').valid()) {
                        $.ajax({
                            type:       'POST',
                            url:        'ws/travel/liquidacion/crear',
                            dataType:   'json',
                            data:       data,
                        })
                        .done(function(response) {
                            if (response.result) {
                                $('#modal-crear').modal('hide'); 
                                toastr['success'](response.message, 'Éxito') 
                                setTimeout( function(){ amigable(); }, 500);
                            } else {
                                toastr['error'](response.message, 'Error');
                            }
                        })
                        .always( function () {
                            $('#loader').hide();
                        });
                    }
                } else {
                     toastr['warning']('Antes de enviar su liquidacion debe ingresar todos los gastos', 'Espere');
                 }
             } else {
                 texto = datos_usuario.MONIBYTE === '' ? 'adelantos' : 'movimientos';
                toastr['error']('No ha agregado '+texto+' a su liquidación', 'Error') 
            }
        } else {
            texto = datos_usuario.MONIBYTE === '' ? 'adelantos' : 'movimientos';
            toastr['error']('No ha agregado '+texto+' a su liquidación', 'Error') 
        }
    }

    function changeMoney (e)
    {
        e.preventDefault();
        json_adelantos = Array();
        $('#detail-data').html('');
    } 

    function changeType (e) 
    {  
         e.preventDefault();
        var datos_usuario = JSON.parse(localStorage.TRAVEL_DATOS_USUARIO);       
        if ($('#tipoN').val() == 'Local') {
            $('#monedaN').attr('disabled','true');
            if(datos_usuario.PAIS == 'GT')
            {
                // $('#colones').hide();
                // $('#quetzales').show();
                $('#monedaN').val('2');
            }
            else if(datos_usuario.PAIS == 'CR')
            {
                // $('#quetzales').hide();
                // $('#colones').show();
                $('#monedaN').val('1');
            }
        } else {
            $('#monedaN').removeAttr('disabled');
        }
    }

    function addLiquidationDetail ()
    {
        $('.modal-footer').show();
        $('#delete-expense').hide();
        liquidacion_id = $(this).data('id');
        $('#btn-crear-gasto').prop('disabled', true);
        var datos_usuario = JSON.parse(localStorage.TRAVEL_DATOS_USUARIO);
        // console.log(datos_usuario);
        $.ajax({
            type:       'GET',
            url:        'ws/travel/liquidacion/detalles',
            dataType:   'json',
            data:       {id_liquidacion: $(this).data('id'), tarjeta: datos_usuario.MONIBYTE}
        })
        .done(function (response){
            //console.log(response);
            if (response.result) {
                $('#mov-list').html('');
                $('#gastos-list').html('');
                $('#new-expense').hide('');
                $('#head-detail-expenses').show('');
                $('#head-detail-mov').show('');
                array_gastos = response.records.gastos;
                if (response.records.tarjeta === '') {
                    $('#head-detail-mov').hide();
                    $('.btn-agregar-gasto').show();
                    $.each(response.records.gastos, function (index, value) {
                        documento = response.records.pais === 'CR' ? 'Cédula' : 'NIT';
                        moneda = '';
                        if (parseInt(value.moneda) == 0) 
                            moneda = '$. ';
                        else if (parseInt(value.moneda) == 1)
                            moneda = '₡. ';
                        else
                            moneda = 'Q. ';
                        var html = '<div class="list-group col-lg-12" >'+
                                        '<strong style="font-size:1.3em;" class="list-group-item-heading col-lg-10">Gasto: <i>'+value.correlativo+'</i></strong>'+
                                        '<span class="badge col-lg-2" style="font-size:1.1em;">'+moneda+parseFloat(value.monton).toFixed(2)+'</span>'+
                                        '<p class="list-group-item-text col-lg-6"><a href="editar-gasto" data-id="'+value.id+'"   class="edit-expense" role="button" data-index="'+index+'" data-toggle="modal" value="Editar gasto" id="editar-gasto" >Editar gasto</a></p>'+
                                        '<p class="list-group-item-text col-lg-6"><a href="eliminar-gasto" data-id="'+value.id+'" class="detele-expense"   role="button" data-toggle="modal" value="Eliminar gasto" id="eliminar-gasto" >Eliminar gasto</a></p>'+
                                        '<p class="list-group-item-text col-lg-6 cedula'+value.id+'"> <b>'+documento+': </b>'+value.documento+'</p>'+
                                        '<p class="list-group-item-text col-lg-6 ceco'+value.id+'"> <b>CECO1: </b>'+value.ceco+'</p>'+
                                        '<p class="list-group-item-text col-lg-6 orden'+value.id+'"> <b>Orden: </b>'+value.orden+'</p>'+
                                        '<p class="list-group-item-text col-lg-6 tributario'+value.id+'"> <b>Código tributario: </b>'+value.codigo_tributario+'</p>'+
                                        '<p class="list-group-item-text col-lg-6 rubro'+value.id+'"> <b>Rubro: </b>'+value.rubro.nombre+'</p>'+
                                        '<p class="list-group-item-text col-lg-6 fecha'+value.id+'"> <b>Fecha: </b>'+value.fecha+'</p>'+
                                        '<p class="list-group-item-text col-lg-6 factura'+value.id+'"> <b>Factura: </b>'+value.factura+'</p>'+
                                        '<p class="list-group-item-text col-lg-6 impuesto'+value.id+'"> <b>Impuesto: </b>'+moneda+parseFloat(value.impuesto).toFixed(2)+'</p>'+
                                        '<p class="list-group-item-text col-lg-6"> <b>Foto de factura: </b><a href="'+value.foto+'" download>Ver fotografía</a></p>'+
                                        '<p class="list-group-item-text col-lg-6 GT retencion_numero'+value.id+'"> <b>No. de Retención: </b>'+value.retencion_numero+'</p>'+
                                        '<p class="list-group-item-text col-lg-6 GT retencion_monto'+value.id+'"> <b>Retención: </b>'+moneda+parseFloat(value.retencion_monto).toFixed(2)+'</p>'+
                                        '<p class="list-group-item-text col-lg-6 GT isr'+value.id+'"> <b>ISR: </b>'+moneda+parseFloat(value.isr).toFixed(2)+'</p>'+
                                    '</div>';
                        $('#gastos-list').append(html);
                    });
                    $('.detele-expense').on('click',prepareExpenseDelete);
                    $('.detele-expense').on('click', addDelete);
                    $('.edit-expense').on('click',prepareExpenseEdit);
                    $('.edit-expense').on('click',addExpense);
                    if (response.records.pais === 'CR')
                        $('.GT').remove();
                    
                } else {
                    $('.btn-agregar-gasto').hide();
                    $('#head-detail-mov').show();
                    console.log(response.records.monibyte);
                    if (response.records.monibyte.length > 0) {
                        localStorage.MOVIMIENTOS = JSON.stringify(response.records.monibyte);
                        // console.log(response.records);
                        $.each(response.records.monibyte, function(index, value) {
                            moneda = '';
                            //console.log(value.moneda);
                            // console.log(value.moneda);
                            if (parseInt(value.moneda) == 0) 
                                moneda = '$. ';
                            else if (parseInt(value.moneda) == 1)
                                moneda = '₡. ';
                            else
                                moneda = 'Q. ';

                            var str_seleccion = value.estado == 2 ? '<input class="select-mov" data-id="'+value.id+'" data-index="'+index+'" style="margin-left: 10%;" type="radio" name="seleccionar" disabled/>' : '<input class="select-mov" data-id="'+value.id+'" data-index="'+index+'" style="margin-left: 10%;" type="radio" name="seleccionar"/>';
                            //console.log(moneda);
                            var monto = value.debito_local != 0 ? value.debito_local : value.debito_inter;
                            var html = '<div class="row">'+
                                            '<div class="col-sm-4">'+
                                                '<div class="input-group">'+
                                                    '<span class="input-group-addon  btn-info">Fecha</span>'+
                                                    '<input type="text" class="form-control" disabled value="'+value.fecha_consumo+'"/>'+
                                                '</div>'+
                                            '</div>'+
                                            '<div class="col-sm-4">'+
                                                '<div class="input-group">'+
                                                    '<span class="input-group-addon  btn-info">Monto</span>'+
                                                    '<input type="text" class="form-control" disabled value="'+moneda+' '+monto+'"/>'+
                                                '</div>'+
                                            '</div>'+
                                            '<div class="col-sm-4">'+
                                                '<div class="input-group">'+
                                                    '<span class="input-group-addon">Seleccionar para gasto'+
                                                        str_seleccion+
                                                    '</span>'+
                                                '</div>'+
                                                '<br>'+
                                            '</div>'+
                                            '<div class="col-sm-6">'+
                                                '<div class="input-group">'+
                                                    '<span class="input-group-addon  btn-info">Establecimiento</span>'+
                                                    '<input type="text" class="form-control" disabled value="'+value.detalles+'"/>'+
                                                '</div>'+
                                            '</div>'+
                                            '<div class="col-sm-6">'+
                                                '<div class="input-group">'+
                                                    '<span class="input-group-addon  btn-info">Tipo</span>'+
                                                    '<input type="text" class="form-control" disabled value="'+value.rubro_id+'"/>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+
                                        '<hr>';
                            $('#mov-list').append(html);
                        });
                        $('input.select-mov').css( 'cursor', 'pointer' );
                        $('input.select-mov').on('click', addExpense);
                    } else {
                        toastr['warning']('No tiene movimientos cargados', 'Espere');
                    }
                    $.each(response.records.gastos, function (index, value) {
                         moneda = '';
                            //console.log(value.moneda);
                            // console.log(value.moneda);
                            if (parseInt(value.moneda) == 0) 
                                moneda = '$. ';
                            else if (parseInt(value.moneda) == 1)
                                moneda = '₡. ';
                            else
                                moneda = 'Q. ';

                        documento = response.records.pais === 'CR' ? 'Cédula' : 'NIT';
                        var html = '<div class="list-group col-lg-12" >'+
                                        '<strong style="font-size:1.3em;" class="list-group-item-heading col-lg-10">Gasto: <i>'+value.correlativo+'</i></strong>'+
                                        '<span class="badge col-lg-2" style="font-size:1.1em;">'+moneda+parseFloat(value.monton).toFixed(2)+'</span>'+
                                        '<p class="list-group-item-text col-lg-6"><a href="editar-gasto" data-id="'+value.id+'"   class="edit-expense deshabilitar" role="button" data-index="'+index+'" data-toggle="modal" value="Editar gasto" id="editar-gasto" >Editar gasto</a></p>'+
                                        '<p class="list-group-item-text col-lg-6" style="color:white">eliminar</p>'+
                                        '<p class="list-group-item-text col-lg-6 cedula'+value.id+'" data-cedula="'+value.documento+'"> <b>'+documento+': </b>'+value.documento+'</p>'+
                                        '<p class="list-group-item-text col-lg-6"> <b>CECO: </b>'+value.ceco+'</p>'+
                                        '<p class="list-group-item-text col-lg-6"> <b>Orden: </b>'+value.orden+'</p>'+
                                        '<p class="list-group-item-text col-lg-6"> <b>Código tributario: </b>'+value.codigo_tributario+'</p>'+
                                        '<p class="list-group-item-text col-lg-6"> <b>Rubro: </b>'+value.rubro.nombre+'</p>'+
                                        '<p class="list-group-item-text col-lg-6"> <b>Fecha: </b>'+value.fecha+'</p>'+
                                        '<p class="list-group-item-text col-lg-6"> <b>Factura: </b>'+value.factura+'</p>'+
                                        '<p class="list-group-item-text col-lg-6"> <b>Impuesto: </b>'+moneda+parseFloat(value.impuesto).toFixed(2)+'</p>'+
                                        '<p class="list-group-item-text col-lg-6"> <b>Foto de factura: </b><a href="'+value.foto+'" download>Ver fotografía</a></p>'+
                                        '<p class="list-group-item-text col-lg-6 GT"> <b>No. de Retención: </b>'+value.retencion_numero+'</p>'+
                                        '<p class="list-group-item-text col-lg-6 GT"> <b>Retención: </b>'+moneda+parseFloat(value.retencion_monto).toFixed(2)+'</p>'+
                                        '<p class="list-group-item-text col-lg-6 GT"> <b>ISR: </b>'+moneda+parseFloat(value.isr).toFixed(2)+'</p>'+
                                    '</div>';
                        $('#gastos-list').append(html);
                    });
                    $('.detele-expense').on('click',prepareExpenseDelete);
                    $('.detele-expense').on('click', addDelete);
                    $('.edit-expense').on('click',prepareExpenseEdit);
                    $('.edit-expense').on('click',addExpense);
                    $('.deshabilitar').on('click',bloquear);
                    if (response.records.pais === 'CR')
                        $('.GT').remove();
                }
            } else {
                toastr['error'](response.message, 'Error');
            }
        });
    }

    function addDelete(){
        $('#head-detail-mov').hide();
        $('#head-detail-expenses').hide();
        $('#delete-expense').show();
        $('.modal-footer').hide();
    }
    function bloquear(){
        $('#monto').prop('disabled',true);
        $('#retencion_numero').prop('disabled',true);
    }
    function addExpense () 
    {
        $('#monto').prop('disabled',false);
        $('#cnta_gasto').prop('disabled',false);
        $('#ceco').prop('disabled',false);
        $('#retencion_numero').prop('disabled',false);
        $('#fecha').val("");
        $('#monto').val("");
        $('#ceco').val("");
        $('#orden').val("");
        $('#cnta_gasto').val("");
        $('#fecha').val("");
        $('#factura').val("");
        $('#monto').val("");
        $('#impuesto').val("");
        $('#codigo_tributario').val("");
        var datos_usuario = JSON.parse(localStorage.TRAVEL_DATOS_USUARIO);
        if (datos_usuario.PAIS != 'GT') {
            $('.GT').hide();
        } else {
            $('.GT').show();
        }
        if (modificar == 1) {
            gasto_seleccionado = array_gastos[$(this).data('index')];
             if (datos_usuario.SOCIEDAD == 'FBEB'  || datos_usuario.SOCIEDAD == 'FRCN') {
                $('#impuesto').prop('disabled',true);
                $('#impuesto').val(0);
            } else {
                $('#impuesto').prop('disabled',false);
            }
            var id=$('#expense_edit_id').val();
            $('.edit').show();
            console.log(gasto_seleccionado.ceco);
            console.log(gasto_seleccionado.orden);
            if (gasto_seleccionado.ceco == "") {
            	$('#ceco').prop('disabled',true);
            }else{
            	console.log("entro a quitar disabled");
            	$('#ceco').removeAttr("disabled");;
            }
            if (gasto_seleccionado.orden == "") {
            	$('#orden').prop('disabled',true);
            }else{
            	$('#orden').removeAttr("disabled");;
            	console.log("entro a quitar disabled");
            }
            $('#new-expense').show();
            $('#head-detail-mov').hide();
            $('#head-detail-expenses').hide();
            $('#documento').prop('disabled',false);
            $('#cnta_gasto').prop('disabled',true);
            $('#fecha').prop('disabled',false);
            $('#monto').prop('disabled',false);
            // $('#orden').prop('disabled',true);
            // $('#ceco').prop('disabled',true);
            $('#factura').prop('disabled',false);
            $('#documento').val(gasto_seleccionado.documento);
            $('#codigo_tributario').append('<option class="ct" value="'+gasto_seleccionado.codigo_tributario+'"> '+gasto_seleccionado.codigo_tributario+' </option>');
            $('#ceco').val(gasto_seleccionado.ceco);
            $('#orden').val(gasto_seleccionado.orden);
            $('#cnta_gasto').val(gasto_seleccionado.cnta_gasto);
            $('#fecha').val(gasto_seleccionado.fecha);
            $('#factura').val(gasto_seleccionado.factura);
            $('#monto').val(gasto_seleccionado.monton);
            $('#impuesto').val(gasto_seleccionado.impuesto);
            $('.edit').on('click',SaveEditExpense);
            function SaveEditExpense(){
            	var ceco_val  = $('#frm-agregar #ceco').val();
		        var orden_val = $('#frm-agregar #orden').val();
		        console.log(ceco_val);
		        console.log(orden_val);
		        if (ceco_val == "" && orden_val == "") {
		        	toastr['error']('Debe ingresar un orden o ceco', 'Error');
		        } else {
	                if (orden_validacion == false && ceco_validacion == false) {
	                toastr['error']('El orden u ceco no son validos', 'Error');
	                }
	                else{
	                    data = {
	                        id_gasto: id,
	                        factura: $('#factura').val(),
	                        fecha: $('#fecha').val(),
	                        cedula: $('#documento').val(),
	                        codigo_tributario: $('#codigo_tributario').val(),
	                        monton:  $('#monto').val()
	                    };
	                    $.ajax({
	                        tyè:        'POST',
	                        url:        'ws/travel/gastos/modificar',
	                        dataType:   'json',
	                        data:       data
	                    })
	                    .done(function (response) {
	                        if (response.result) {
	                            toastr['success'](response.message, 'Éxito');
	                            $('#modal-agregar').modal('hide');  
	                            setTimeout( function(){ amigable(); }, 500);
	                            array_gastos=new Array();
	                            $('.edit').on('click',SaveEditExpense);
	                        } else {
	                            toastr['error'](response.message, 'Error'); 
	                        }
	                    })
	                    .always(function () {
	                        $('#loader').fadeOut();
	                    });
	                }
	            }
            }
        } else {
            $('.edit').hide();
        
            if (datos_usuario.SOCIEDAD == 'FBEB'  || datos_usuario.SOCIEDAD == 'FRCN') {
                $('#impuesto').prop('disabled',true);
                $('#impuesto').val(0);
            } else {
                $('#impuesto').prop('disabled',false);
            }
            if (datos_usuario.MONIBYTE != '') {
                moneda = '';
                var validacion = localStorage.getItem("MOVIMIENTOS");
                if (!validacion) {
                    toastr['error']("No posee movimientos en su tarjeta", 'Error');
                    $("#modal-agregar").modal("hide");
                    return ;
                }
                movimientos = JSON.parse(localStorage.MOVIMIENTOS);
                item_movimiento = movimientos[$(this).data('index')];
                monto = item_movimiento.debito_local == 0 ? item_movimiento.debito_inter : item_movimiento.debito_local;
                if (item_movimiento.moneda == 0) 
                    moneda = '$';
                else if (item_movimiento.moneda == 1)
                    moneda = '₡';
                else
                    moneda = 'Q';
                
                $('#movimiento-id').val($(this).data('id'));
                $('#new-expense').show();
                $('#head-detail-mov').hide();
                $('#head-detail-expenses').hide();
                $('#btn-crear-gasto').prop('disabled', false);
                $('#cnta_gasto').val(item_movimiento.rubro);
                $('#fecha').val(item_movimiento.fecha_consumo);
                $('#monto').val(monto).prop('disabled', true);
                $('span.moneda-simbolo').text(moneda);
                $('#ceco').val(datos_usuario.CECO);
                $('#orden').prop('disabled', true);
            } else {
                $('#movimiento-id').val($(this).data('id'));
                $('#new-expense').show();
                $('#head-detail-mov').hide();
                $('#head-detail-expenses').hide();
                $('#btn-crear-gasto').prop('disabled', false);
                $('#ceco').val(datos_usuario.CECO);
                $('#orden').prop('disabled', true);
                $('#fecha').prop('disabled',false);
                $('#monto').prop('disabled',false);
                $('#cnta_gasto').prop('disabled',false);
            }
        }
    }

    function backData () 
    {
        modificar=0;
        $('#documento').prop('disabled',false);
        // $('#head-detail-mov').show();
        // $('#head-detail-expenses').show();
        $('#delete-expense').hide();
        $('.modal-footer').show();
        var datos_usuario = JSON.parse(localStorage.TRAVEL_DATOS_USUARIO);
        if ( datos_usuario.MONIBYTE == '') {
            $('#new-expense').hide();
            $('#head-detail-mov').hide();
            $('#head-detail-expenses').show();
            $('#btn-crear-gasto').prop('disabled', true);
        } else {
            $('#new-expense').hide();
            $('#head-detail-mov').show();
            $('#head-detail-expenses').show();
            $('#btn-crear-gasto').prop('disabled', true);
        }
        $('#documento').val('');
        $('#fecha').val('');
        $('#factura').val('');
        $('#monto').val('');
        $('#impuesto').val('');
        $('#origen').val('');
    }

    function searchCedula () 
    {   
        $("#codigo_tributario").empty();
        var datos_usuario = JSON.parse(localStorage.TRAVEL_DATOS_USUARIO);
        if (datos_usuario.PAIS == 'GT') {
            $('#codigo_tributario').append($('<option>', {
                value: 'FS',
                text: 'FS Factura Servicio',
            }));
            $('#codigo_tributario').append($('<option>', {
                value: 'FA',
                text: 'FA Factura',
            }));
            $('#codigo_tributario').append($('<option>', {
                value: 'FC',
                text: 'FC Factura Combustible',
            }));
            $('#codigo_tributario').append($('<option>', {
                value: 'FE',
                text: 'FE Factura Especial',
            }));
            $('#codigo_tributario').append($('<option>', {
                value: 'FX',
                text: 'FX Factura Extenta',
            }));
            $('#codigo_tributario').append($('<option>', {
                value: 'RC',
                text: 'RC Recibo',
            }));
            $('#codigo_tributario').append($('<option>', {
                value: 'RM',
                text: 'RM Remision',
            }));
            $('#codigo_tributario').append($('<option>', {
                value: 'INV',
                text: 'INV Invoice',
            }));

        } else {
            $('#codigo_tributario').append($('<option>', {
                value: 2021,
                text: '2021 Compras mercancías',
            }));
            $('#codigo_tributario').append($('<option>', {
                value: 2222,
                text: '2222 Compras Bienes muebles(para comercialización)',
            }));
            $('#codigo_tributario').append($('<option>', {
                value: 2323,
                text: '2323 Compras Bienes inmuebles(para comercialización',
            }));
            $('#codigo_tributario').append($('<option>', {
                value: 3031,
                text: '3031 Compras insumos o materia prima',
            }));
            $('#codigo_tributario').append($('<option>', {
                value: 4040,
                text: '4040 Compras bienes inmuebles(para uso como activo de la empresa',
            }));
            $('#codigo_tributario').append($('<option>', {
                value: 4141,
                text: '4141 Compras bienes muebles(para uso como activo de la empresa',
            }));
            $('#codigo_tributario').append($('<option>', {
                value: 4242,
                text: '4242 Compras autorizadas sin el pago de impuestos',
            }));
            $('#codigo_tributario').append($('<option>', {
                value: 4647,
                text: '4647 Otros servicios',
            }));
            $('#codigo_tributario').append($('<option>', {
                value: 4848,
                text: '4848 Alquileres',
            }));
        }
    }

    function searchCeco () 
    {
        var datos_usuario = JSON.parse(localStorage.TRAVEL_DATOS_USUARIO);
        ceco_validacion=false;
        $.ajax({
            url:        'ws/ordenceco/sociedad',
            type:       'GET',
            dataType:   'json',
            data:       {ceco: $('#ceco').val(), orden: $('#orden').val(), sociedad:datos_usuario.SOCIEDAD},
        })
        .done(function (response) {
            if (response.result) {
                toastr['success'](response.message, 'Éxito');
                ceco_validacion=true;
            } else {
                toastr['error'](response.message, 'Error');
                ceco_validacion=false;
            }
        });
    }
    
    function changeCeco (e)
    {
        e.preventDefault();
        if ($('#ceco').val()) {
            $('#btn-buscar-orden').attr('disabled', 'disabled');
            $('#btn-buscar-orden').css('pointer-events', 'none');
            $('#orden').prop('disabled', true);
        } else {
            $('#btn-buscar-orden').removeAttr('disabled', 'disabled');
            $('#btn-buscar-ceco').css('pointer-events', '');
            $('#orden').prop('disabled', false);
        }
        ceco_validacion=true;
        console.log("entro a cambiar el ceco y la validacion es falsa");
    }

    function searchOrden () 
    {
        var datos_usuario = JSON.parse(localStorage.TRAVEL_DATOS_USUARIO);

        $.ajax({
            url:        'ws/ordenceco/sociedad',
            type:       'GET',
            dataType:   'json',
            data:       {ceco: $('#ceco').val(), orden: $('#orden').val(), sociedad:datos_usuario.SOCIEDAD},
        })
        .done(function (response) {
            if (response.result) {
                toastr['success'](response.message, 'Éxito');
                orden_validacion=true;
            } else {
                toastr['error'](response.message, 'Error');
                orden_validacion=false;
            }
        });
    }

    function changeOrden (e)
    {
        e.preventDefault();
        if ($('#orden').val()) {
            $('#btn-buscar-ceco').attr('disabled', 'disabled');
            $('#btn-buscar-ceco').css('pointer-events', 'none');
            $('#ceco').prop('disabled', true);
        } else {
            $('#btn-buscar-ceco').removeAttr('disabled', 'disabled');
            $('#btn-buscar-ceco').css('pointer-events', '');
            $('#ceco').prop('disabled', false);
        }
        orden_validacion=true;
    }

    function addRubros()
    {
        $('#cnta_gasto').html('');
        $.ajax({
            url:        'ws/travel/cuentas/detalles',
            type:       'GET',
            dataType:   'json',
        })
        .done(function(data) {
            if( data.records.length > 0 ){
                $.each( data.records, function( index,value ){ 
                    $('#cnta_gasto').append('<option value="'+value.id+'"> '+value.cuenta.nombre+' ('+value.nombre+') </option>');    
                });
            }
        });
    }

    function generarGasto()
    {
        $('#frm-agregar')[0].reset();
        $('#loader').show();
        var index = $(this).data('index');

        if( index >=0 ){
            $('#id_adelanto').val( BD[index].id );

            if( $('#tipotransa').val() == 'Moni' ){
                $('.adelantos').removeAttr('disabled');
                $('.movimientos').attr('disabled','true');
                $('.itemsc').removeClass('active');
                $('#itemsb_'+index).addClass('active');
                $('#gastos').css('display','');
                $('#fecha').val( BD[index].fecha );
                $('.rubros').remove();
                $('#cnta_gasto').append('<option class="rubros" value="'+BD[index].rubro.rubro_id+'">'+BD[index].rubro.rubro_nombre+'</option>');
                $('#monto').val( BD[index].total.toFixed(2) );
                $('.montonumis').text( BD[index].moneda_simbolo );
            }else{
                switch(BD[index].tipo_moneda){
                    case '0': moneda='$'; break;
                    case '1': moneda='₡'; break;
                    case '2': moneda='Q'; break;
                }
                $('.movimientos').removeAttr('disabled');
                $('.adelantos').attr('disabled','true');
                $('.itemsc').removeClass('active');
                $('#itemsb_'+index).addClass('active');
                $('#gastos').css('display','');
                $('#fecha').val( formato_fecha(BD[index].fecha_entrega) );
                $('#monto').val( parseInt(BD[index].monto).toFixed(2) );
                $('.montonumis').text( moneda );
                agregarRubros();
            }
        }else{
            $('.itemsc').removeClass('active');
            switch(Moneda){
                    case '0': moneda='$'; break;
                    case '1': moneda='₡'; break;
                    case '2': moneda='Q'; break;
                }
            $('#ceco').removeAttr('disabled');
            $('#orden').removeAttr('disabled');
            $('.movimientos').removeAttr('disabled');
            $('.adelantos').removeAttr('disabled');
            $('#gastos').css('display','');
            agregarRubros();
            $('.rubros').remove();
            $('.montonumis').text( moneda );
        }
        
        $('#btn-agregar').removeAttr( 'disabled' );

        $('.GT').css('display','none');

        $('#buscarceco').removeClass('btn-success');
        $('#buscarceco').addClass('btn-danger');
        $('#buscarcecoico').removeClass('fa-check');
        $('#buscarcecoico').addClass('fa-search');

        $('#buscar').removeClass('btn-success');
        $('#buscar').addClass('btn-danger');
        $('#buscarico').addClass('fa-search');
        $('#buscarico').removeClass('fa-check');

        $('#buscarorden').removeClass('btn-success');
        $('#buscarordenico').removeClass('fa-check');
        $('#buscarorden').addClass('btn-danger');
        $('#buscarordenico').addClass('fa-search');

        //Fotografia
        $('#origen-lbl').removeClass('btn-success');
        $('#origen-lbl').removeClass('btn-danger');
        $('#origen-lbl').addClass('btn-danger');

        if( $('#pais').val() =='GT' ){
            $('.documento').text('No. de NIT');
            $('.GT').css('display','');
        }
        else{
            $('.documento').text('No. de Cédula');
            $('.GT').css('display','none');
        }

        $('#loader').hide();
    }

    function saveExpense (e)
    {
        e.preventDefault();
        var ceco_val  = $('#frm-agregar #ceco').val();
        var orden_val = $('#frm-agregar #orden').val();
        // console.log(ceco_val);
        // console.log(orden_val);
        if (ceco_val == "" && orden_val == "") {
           toastr['error']('Debe ingresar un orden o ceco', 'Error');
        }else {
        	if (orden_validacion == false && ceco_validacion == false) {
        		toastr['error']('El orden u ceco no son validos', 'Error');
        	} else {
		        $('#loader').show();
		        var datos_usuario = JSON.parse(localStorage.TRAVEL_DATOS_USUARIO);
		        var form_data = new FormData($('#frm-agregar')[0]);
		        form_data.append('id_liquidacion', liquidacion_id);
		        form_data.append('usuario_creo', uid_usuario);
		        form_data.append('sociedad', datos_usuario.SOCIEDAD);
		        form_data.append('id_monibyte', $('#movimiento-id').val());
		        form_data.append('ceco', $('#ceco').val());
		        form_data.append('orden', $('#orden').val());
		        form_data.append('cnta_gasto', $('#cnta_gasto').val());
		        form_data.append('monto', $('#monto').val());
                form_data.append('fecha', $('#fecha').val());
		        for(var pair of form_data.entries()) {
		           // console.log(pair); 
		        }
                console.log(form_data);
		        $.ajax({
		            url:            'ws/travel/gastos/crear',
		            type:           'POST',
		            dataType:       'json',
		            data:           form_data, 
		            async:          false,
		            cache:          false,
		            contentType:    false,
		            processData:    false,                 
		        })
		        .done(function(response) {
		            if (response.result) {
		                $('#modal-agregar').modal('hide'); 
		                toastr['success'](response.message, 'Éxito') 
		                setTimeout( function(){ amigable(); }, 500);
		            } else {
		                toastr['error'](response.message, 'Error');
		            }
		        })
		        .always(function() {
		            $('#loader').hide();
		        });
		    }
        }
    }

    function prepareLiquidation () 
    {
        $('#liquidacion_id').val($(this).data('id'));
    }
    function prepareLiquidationDelete () 
    {
        $('#liquidacion_id').val($(this).data('id'));
    }
    function prepareExpenseDelete () 
    {
        $('#expense_id').val($(this).data('id'));
    }
    function prepareExpenseEdit () 
    {
        modificar=1;
        $('#expense_edit_id').val($(this).data('id'));
    }
    function deleteLiquidation (e)
    {
        e.preventDefault();
        $('#loader').show();
        $.ajax({
            url:        'ws/travel/liquidacion/eliminar',
            type:       'POST',
            dataType:   'json',
            data:       {id_liquidacion: $('#liquidacion_id').val()},                  
        })
        .done( function(response) {
            if (response.result) {
                $('#modal-eliminar').modal('hide'); 
                toastr['success'](response.message, 'Éxito') 
                setTimeout( function(){ amigable(); }, 500);
            } else {
                toastr['error'](response.message, 'Error');
            }
        })
        .always(function(){
            $('#loader').hide();
        });
    }
    function deleteExpense (e)
    {
        e.preventDefault();
        $('#loader').show();
        $.ajax({
            url:        'ws/travel/liquidaciongastos/eliminar/gasto',
            type:       'POST',
            dataType:   'json',
            data:       {id_gasto: $('#expense_id').val()},                  
        })
        .done( function(response) {
            if (response.result) {
                $('#modal-agregar').modal('hide'); 
                toastr['success'](response.message, 'Éxito') 
                $('.modal-footer').show();
                $('#delete-expense').hide();
                setTimeout( function(){ amigable(); }, 500);
            } else {
                toastr['error'](response.message, 'Error');
            }
        })
        .always(function(){
            $('#loader').hide();
        });
    }
    function sendLiquidation (e)
    {
        e.preventDefault();
        $('#loader').show();
        $.ajax({
            url:        'ws/travel/liquidacion/enviar',
            type:       'POST',
            dataType:   'json',
            data:       {id_liquidacion: $('#liquidacion_id').val()},                  
        })
        .done( function(response) {
            if (response.result) {
                $('#modal-enviar').modal('hide'); 
                toastr['success'](response.message, 'Éxito') 
                setTimeout( function(){ amigable(); }, 500);
            } else {
                toastr['error'](response.message, 'Error');
            }
        })
        .always(function(){
            $('#loader').hide();
        });
    }
});