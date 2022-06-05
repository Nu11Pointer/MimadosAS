// Variables Globales
var rowSelected;
var productTable;
var productObj;

// Evento Document Loaded
document.addEventListener('DOMContentLoaded', function () {
    SetUp();
});

// Función Principal
function SetUp() {
    // Pintar Menu Collapse
    $('#CollapseMenuProducts').addClass('active');
    $('#collapseFive').addClass('show');
    $('#CollapseMenuItemProduct').addClass('active');

    // Mostrar DataTable
    Read();

    // Cargar Selectores
    LoadSelectors();

    // Crear Validaciones
    Validator();

    // Establecer Actualizar
    $("#dataTable tbody").on("click", '.btn-update', ShowUpdateModal);

    // Establecer Eliminar
    $("#dataTable tbody").on("click", '.btn-detelete', Delete);
}

// Cargar DataTable
function Read() {
    productTable = $('#dataTable').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/Product/Read',
            type: "GET",
            dataType: "json"
        },
        "columns": [
            { "data": "Id" },
            { "data": "Name" },
            { "data": "ProductBrand.Name" },
            { "data": "ProductCategory.Name" },
            { "data": "StringNetContent" },
            { "data": "SalePrice", "render": value => "C$" + value.toFixed(2) },
            { "data": "Stock" },
            {
                "data": "Active", "render": function (value) {
                    if (value)
                        return '<h5><span class="badge badge-success">Habilitado</span></h5>';
                    else
                        return '<h5><span class="badge badge-danger">Deshabilitado</span></h5>';
                }
            },
            {
                "defaultContent": '<button type="button" class="btn btn-primary btn-circle btn-sm btn-update mr-1 mb-1 data-toggle="tooltip" title="Editar producto""><i class="fas fa-pen"></i></button>' +
                    '<button type="button" class="btn btn-danger btn-circle btn-sm ms-2 btn-detelete mr-1 mb-1 data-toggle="tooltip" title="Eliminar producto""><i class="fas fa-trash"></i></button>',
                "orderable": false,
                "searchable": false
            }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
        }
    });
}

// Cargar Selectores (Combo Boxes)
function LoadSelectors() {

    // Peticion Marcas
    jQuery.ajax({
        url: '/ProductBrand/ReadActive',
        type: "GET",
        data: null,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $.each(data.data, function (_index, value) {
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#ProductBrandCreate");
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#ProductBrandUpdate");
            })
        },
        error: function (error) {
            console.log(error);
        }
    });

    // Peticion Categorias
    jQuery.ajax({
        url: '/ProductCategory/ReadActive',
        type: "GET",
        data: null,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $.each(data.data, function (_index, value) {
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#ProductCategoryCreate");
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#ProductCategoryUpdate");
            })
        },
        error: function (error) {
            console.log(error);
        }
    });

    // Peticion ProductPackaging
    jQuery.ajax({
        url: '/ProductPackaging/Read',
        type: "GET",
        data: null,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $.each(data.data, function (_index, value) {
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#ProductPackagingCreate");
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#ProductPackagingUpdate");
            })
        },
        error: function (error) {
            console.log(error);
        }
    });

    // Peticion ProductMeasurementUnit
    jQuery.ajax({
        url: '/ProductMeasurementUnit/Read',
        type: "GET",
        data: null,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $.each(data.data, function (_index, value) {
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#ProductMeasurementUnitCreate");
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#ProductMeasurementUnitUpdate");
            })
        },
        error: function (error) {
            console.log(error);
        }
    });
}

// Mostrar Modal Para Crear Producto
function ShowCreateModal() {
    $("#NameCreate").val("");
    $("#SalePriceCreate").val(0);
    $("#StockCreate").val(0);
    $("#ProductCategoryCreate").val($("#ProductCategoryCreate option:first").val());
    $("#ProductPackagingCreate").val($("#ProductPackagingCreate option:first").val());
    $("#NetContentCreate").val(0.01);
    $("#ProductMeasurementUnitCreate").val($("#ProductMeasurementUnitCreate option:first").val());
    $("#ProductBrandCreate").val($("#ProductBrandCreate option:first").val());
    $("#ActiveCreate").val($("#ActiveCreate option:first").val());
    $("#DescriptionCreate").val("");
    $("#FormModalCreate").modal("show");
    $("#ErrorCreate").hide();
    productTable.columns.adjust().responsive.recalc();
}

// Configuración Jquery Validator
function Validator() {

    // Configurar Validaciones Al Crear
    $("#CreateForm").validate({
        rules: {
            NameCreate: {
                required: true
            },
            NetContentCreate: {
                required: true,
                number: true
            },
            SalePriceCreate: {
                required: true,
                number: true
            },
            StockCreate: {
                required: true,
                number: true
            }
        },
        messages: {
            NameCreate: {
                required: "Este campo es obligatorio."
            },
            NetContentCreate: {
                required: "Este campo es obligatorio.",
                number: "Este campo debe ser numerico.",
                min: "El valor minímo de este campo es 0.01."
            },
            SalePriceCreate: {
                required: "Este campo es obligatorio.",
                number: "Este campo debe ser numerico.",
                min: "El valor minímo de este campo es 0.00.",

            },
            StockCreate: {
                required: "Este campo es obligatorio.",
                number: "Este campo debe ser numerico.",
                min: "El valor minímo de este campo es 0.",
                step: "Este campo debe ser multiplo de 1."
            }
        },
        errorClass: "errorTextForm",
        errorElement: "p"
    });

    // Configurar Validaciones Al Actualizar
    $("#UpdateForm").validate({
        rules: {
            NameUpdate: {
                required: true
            },
            NetContentUpdate: {
                required: true,
                number: true
            },
            SalePriceUpdate: {
                required: true,
                number: true
            },
            StockUpdate: {
                required: true,
                number: true
            }
        },
        messages: {
            NameUpdate: {
                required: "Este campo es obligatorio."
            },
            NetContentUpdate: {
                required: "Este campo es obligatorio.",
                number: "Este campo debe ser numerico.",
                min: "El valor minímo de este campo es 0.01."
            },
            SalePriceUpdate: {
                required: "Este campo es obligatorio.",
                number: "Este campo debe ser numerico.",
                min: "El valor minímo de este campo es 0.00.",
            },
            StockUpdate: {
                required: "Este campo es obligatorio.",
                number: "Este campo debe ser numerico.",
                min: "El valor minímo de este campo es 0.",
                step: "Este campo debe ser multiplo de 1."
            }
        },
        errorClass: "errorTextForm",
        errorElement: "p"
    });
}

// Crear Producto
function Create() {

    // Validar Campos
    if (!$("#CreateForm").valid()) {
        return;
    }

    // Crear Objeto Producto
    productObj = {
        "Id": 0,
        "ProductBrand": {
            "Id": $("#ProductBrandCreate option:selected").val()
        },
        "ProductCategory": {
            "Id": $("#ProductCategoryCreate option:selected").val()
        },
        "ProductPackaging": {
            "Id": $("#ProductPackagingCreate option:selected").val()
        },
        "ProductMeasurementUnit": {
            "Id": $("#ProductMeasurementUnitCreate option:selected").val()
        },
        "Name": $("#NameCreate").val(),
        "Description": $("#DescriptionCreate").val(),
        "SalePrice": $("#SalePriceCreate").val(),
        "NetContent": $("#NetContentCreate").val(),
        "Stock": $("#StockCreate").val(),
        "Active": $("#ActiveCreate option:selected").val() == 1 ? true : false
    };

    // Realizar La Petición
    jQuery.ajax({
        url: '/Product/Create',
        type: "POST",
        data: JSON.stringify({ product: productObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            // Ocultar Carga y Modal
            $(".modal-body").LoadingOverlay("hide");
            $("#FormModalCreate").modal("hide");

            // Si se creo entonces notificar
            if (response.result) {
                successAudio.play();
                swal({
                    title: "¡Buen trabajo!",
                    text: "¡Has creado un nuevo producto!",
                    type: "success",
                    confirmButtonClass: "btn-success",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        productTable.ajax.reload();
                    });
            }
            // Sino entonces notificar
            else {
                var text = response.message;
                if (response.message.includes("Referencia a objeto no establecida como instancia de un objeto.")) {
                    text = "No se proporcionó uno o más campos del formulario.";
                }
                errorAudio.play();
                swal({
                    title: "¡Algo salió mal!",
                    text: text,
                    type: "error",
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        $("#FormModalCreate").modal("show");
                    }
                );
            }
        },
        error: function (error) {
            $(".modal-body").LoadingOverlay("hide");
            $("#ErrorCreate").text(error.responseText);
            $("#ErrorCreate").show();
        },
        beforeSend: function () {

            $(".modal-body").LoadingOverlay("show", {
                imageResizeFactor: 2,
                text: "Cargando...",
                size: 14
            });
        }
    });
}

// Mostrar Modal Actualizar
function ShowUpdateModal() {

    // Obtener La Fila Con La Información Seleccionada
    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    // Crear El Objeto
    productObj = productTable.row(rowSelected).data();

    // Cargar Campos
    $("#NameUpdate").val(productObj.Name);
    $("#SalePriceUpdate").val(productObj.SalePrice);
    $("#StockUpdate").val(productObj.Stock);
    $("#ProductCategoryUpdate").val(productObj.ProductCategory.Id);
    $("#ProductPackagingUpdate").val(productObj.ProductPackaging.Id);
    $("#NetContentUpdate").val(productObj.NetContent);
    $("#ProductMeasurementUnitUpdate").val(productObj.ProductMeasurementUnit.Id);
    $("#ProductBrandUpdate").val(productObj.ProductBrand.Id);
    $("#ActiveUpdate").val(productObj.Active ? 1 : 0);
    $("#DescriptionUpdate").val(productObj.Description);
    $("#FormModalUpdate").modal("show");
    $("#ErrorUpdate").hide();
}

// Actualizar Producto
function Update() {

    // Validar Campos
    if (!$("#UpdateForm").valid()) {
        return;
    }

    // Crear Objeto
    productObj = {
        "Id": productObj.Id,
        "ProductBrand": {
            "Id": $("#ProductBrandUpdate option:selected").val()
        },
        "ProductCategory": {
            "Id": $("#ProductCategoryUpdate option:selected").val()
        },
        "ProductPackaging": {
            "Id": $("#ProductPackagingUpdate option:selected").val()
        },
        "ProductMeasurementUnit": {
            "Id": $("#ProductMeasurementUnitUpdate option:selected").val()
        },
        "Name": $("#NameUpdate").val(),
        "Description": $("#DescriptionUpdate").val(),
        "SalePrice": $("#SalePriceUpdate").val(),
        "NetContent": $("#NetContentUpdate").val(),
        "Stock": $("#StockUpdate").val(),
        "Active": $("#ActiveUpdate option:selected").val() == 1 ? true : false
    };

    // Realizar Solicitud
    jQuery.ajax({
        url: '/Product/Update',
        type: "POST",
        data: JSON.stringify({ product: productObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            // Ocultar Carga y Modal
            $(".modal-body").LoadingOverlay("hide");
            $("#FormModalUpdate").modal("hide");
            // Si se creó entonces notificar
            if (response.result) {
                successAudio.play();
                swal({
                    title: "¡Buen trabajo!",
                    text: "¡Has actualizado el producto!",
                    type: "success",
                    confirmButtonClass: "btn-success",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        productTable.ajax.reload();
                    });
            }
            // Sino entonces notificar
            else {
                var text = response.message;
                if (response.message.includes("Referencia a objeto no establecida como instancia de un objeto.")) {
                    text = "No se proporcionó uno de los campos del formulario.";
                }
                errorAudio.play();
                swal({
                    title: "¡Algo salió mal!",
                    text: text,
                    type: "error",
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        $("#FormModalUpdate").modal("show");
                    }
                );
            }
        },
        error: function (error) {

            $(".modal-body").LoadingOverlay("hide");
            $("#ErrorUpdate").text(error.responseText);
            $("#ErrorUpdate").show();
        },
        beforeSend: function () {

            $(".modal-body").LoadingOverlay("show", {
                imageResizeFactor: 2,
                text: "Cargando...",
                size: 14
            });
        }
    });
}

// Borrar Producto
function Delete() {

    // Seleccionar Fila Con La Información Requerida
    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    // Crear Objeto
    productObj = productTable.row(rowSelected).data();

    if (!productObj.Active) {
        warningAudio.play();
        swal("Información", "El producto se encuentra deshabilitado, no puede realizar esta acción.", "info");
        return;
    }

    warningAudio.play();

    // Preguntar antes de eliminar
    swal({
        title: "Eliminar Producto",
        text: "¡No podrás recuperar este producto!",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "¡Sí, bórralo!",
        cancelButtonText: "¡No, cancela por favor!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
        function (isConfirm) {
            // Si el usuario confirma entonces eliminarlo
            if (isConfirm) {
                jQuery.ajax({
                    url: '/Product/Delete',
                    type: "POST",
                    data: JSON.stringify({ product: productObj }),
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (response) {
                        // Si se eliminó entonces notificar y actualizar tabla
                        if (response.result) {
                            successAudio.play();
                            swal({
                                title: "¡Eliminado!",
                                text: "Su producto ha sido eliminado.",
                                type: "success",
                                confirmButtonClass: "btn-success",
                                confirmButtonText: "Aceptar",
                                closeOnConfirm: true
                            },
                                function () {
                                    productTable.ajax.reload();
                                }
                            );
                        }
                        // Sino Entonces Notificar Error
                        else {
                            var text = response.message;
                            if (response.message.includes("\"FK__SaleDetai__Produ__0A9D95DB\"")) {
                                text = "El producto que tratas de eliminar está siendo utilizado en los registros de ventas.";
                            }
                            if (response.message.includes("\"FK__PurchaseD__Produ__4B422AD5\"")) {
                                text = "El producto que tratas de eliminar está siendo utilizado en los registros de compras.";
                            }
                            errorAudio.play();
                            swal({
                                title: "¡Algo salió mal!",
                                text: text,
                                type: "error",
                                confirmButtonClass: "btn-danger",
                                confirmButtonText: "Aceptar",
                                closeOnConfirm: true
                            });
                        }
                    },
                    error: function (error) {
                        console.log(error);
                    },
                    beforeSend: function () { }
                });
            }
            // Sino entonces notificar la cancelación
            else {
                swal("Cancelado", "Su producto está intacto.", "info");
            }
        }
    );
}
