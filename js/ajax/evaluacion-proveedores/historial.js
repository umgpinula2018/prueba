jQuery(document).ready(function($){
	var id_registro = 0;
	var id_registro_eliminar = 0;
	var id_registro_eliminar = 0;
    window.tabla_registros = $("#tabla-registros").DataTable({
        "language": 
        {
            "url": "/lang/esp.lang"
        },
            
        processing: true,
        serverSide: true,
        searching: true,
        ajax: 'ws/evaluacion/proveedores/lista/historial',
        columns: [
            {data: 'DT_Row_Index', name: 'DT_Row_Index',},
            {data: 'no_solped', name: 'no_solped'},
            {data: 'texto_breve', name: 'texto_breve'},
            {data: 'solicitante', name: 'solicitante'},
            {data: 'proveedor', name: 'proveedor'},
            {data: 'nombre_proveedor', name: 'nombre_proveedor'},
            {data: 'correo_proveedor', name: 'correo_proveedor'},
            {data: 'valor_moneda', name: 'valor_moneda'},
            {data: 'resultado_evaluacion', name: 'resultado_evaluacion'},
            {data: 'estado_nombre', name: 'estado_nombre'},
            {data: 'acciones', name: 'acciones'},
        ],
         'columnDefs': [
            { 'searchable': false, 'targets': [8,9] }
          ]
    });
	 var contador=1;
    // llenarTabla();  

     $('#form-crear #btn-añadir').on('click',function(e){  
        e.preventDefault();
        $('#formulario').append('<div class="form-group nuevo" id="formulario'+contador+'">'+
                                   '<div class="form-group" id="formulario">'+
                                        '<div class="col-md-10">'+
                                            '<label>Correo:</label>'+
                                            '<input type="text" class="form-control" id="nombre" name="nombre">'+
                                        '</div>'+
                                        '<div class="col-md-2">'+
                                            '<a class="btn btn-danger btn-md btn-eliminar-fila" title="Eliminar fila" data-idregistro="'+contador+'" style="margin-top:25px;"><i class="fa fa-trash"></i></a>'+
                                        '</div>'+
                                    '</div>'+   
                                '</div>');
        contador = contador+1;
         $('#formulario .btn-eliminar-fila').on('click',function(e){
            e.preventDefault();
            var id = $(this).data('idregistro');
            $('#form-crear #formulario'+id+'').remove();
        });
    });
    $('#btn-registrar').on('click',reenviar);

    function reenviar(){
       $('#loader').show();
        var array;
        var correos="";
        if (contador == 1) {
            var array2 = [];
            correo = {
                correo : $('#formulario #nombre').val()
             }
            array2.push(correo);
        } else if(contador>1){
            var array2 = [];
            correo = {
                correo : $('#formulario #nombre').val()
             }
             array2.push(correo);
            for (var i = 1; i < contador; i++) {
                if ($('#formulario'+i+'').hasClass('nuevo')) {
                    correo = {
                        correo : $('#formulario'+i+' #nombre').val()
                    }
                    array2.push(correo);    
                } 
            }
        }
        $.ajax({
            url:        'ws/evaluacion/proveedores/enviar/correo',
            type:       'POST',
            dataType:   'json',
            data:       {correos:JSON.stringify(array2),id:id_registro}
        })
        .done(function(response){
            if (response.result) {
                toastr['success'](response.message, 'Éxito');
                $('#modal-reenviar').modal('hide');
                contador=1;
                $('.nuevo').remove();
            } else {
                toastr['warning'](response.message, 'Cuidado');
            }
        })
        .fail(function(response){
            toastr['error'](response.message, 'Error');
        })
        .always(function(){ $('#loader').fadeOut(); })
    }
    $('#tabla-registros').on('click', 'a.btn-reenviar', function() {
        id_registro= $(this).data('idregistro')
        $('#nombre').removeClass('valid');
        $('#nombre').removeClass('error');
        $("#form-crear").validate().resetForm();
        $('.nuevo').remove();
        $('#nombre').val('');
    });
    function llenarTabla(){
       window.tabla_registros.destroy();
       window.tabla_registros = $("#tabla-registros").DataTable({
        "language": 
        {
            "url": "/lang/esp.lang"
        },
            
        processing: true,
        serverSide: true,
        searching: true,
        ajax: 'ws/evaluacion/proveedores/lista/historial',
        columns: [
            {data: 'DT_Row_Index', name: 'DT_Row_Index',},
            {data: 'no_solped', name: 'no_solped'},
            {data: 'texto_breve', name: 'texto_breve'},
            {data: 'solicitante', name: 'solicitante'},
            {data: 'proveedor', name: 'proveedor'},
            {data: 'nombre_proveedor', name: 'nombre_proveedor'},
            {data: 'correo_proveedor', name: 'correo_proveedor'},
            {data: 'valor_moneda', name: 'valor_moneda'},
            {data: 'estado_nombre', name: 'estado_nombre'},
            {data: 'acciones', name: 'acciones'},
        ],
         'columnDefs': [
            { 'searchable': false, 'targets': [8,9] }
          ]
    });
    }

});