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
                "defaultContent": '<button type="button" class="btn btn-primary btn-circle btn-sm btn-update mr-1 mb-1"><i class="fas fa-pen"></i></button>' +
                    '<button type="button" class="btn btn-danger btn-circle btn-sm ms-2 btn-detelete mr-1 mb-1"><i class="fas fa-trash"></i></button>',
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
        url: '/ProductBrand/Read',
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
        url: '/ProductCategory/Read',
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
    $("#NetContentCreate").val(0);
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
                required: "- El campo \"Nombre\" es obligatorio."
            },
            NetContentCreate: {
                required: "- El campo \"Contenido Neto\" es obligatorio.",
                number: "- El campo \"Contenido Neto\" debe ser numerico.",
                min: "- El Campo \"Contenido Neto\" no puede ser negativo."
            },
            SalePriceCreate: {
                required: "- El campo \"Precio Venta\" es obligatorio.",
                number: "- El campo \"Precio Venta\" debe ser numerico.",
                min: "- El Campo \"Precio Venta\" no puede ser negativo.",

            },
            StockCreate: {
                required: "- El campo \"Stock\" es obligatorio.",
                number: "- El campo \"Stock\" debe ser numerico.",
                min: "- El Campo \"Stock\" no puede ser negativo.",
                step: "- El Campo \"Stock\" debe ser multiplo de 1."
            }
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
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
                required: "- El campo \"Nombre\" es obligatorio."
            },
            NetContentUpdate: {
                required: "- El campo \"Contenido Neto\" es obligatorio.",
                number: "- El campo \"Contenido Neto\" debe ser numerico.",
                min: "- El Campo \"Contenido Neto\" no puede ser negativo."
            },
            SalePriceUpdate: {
                required: "- El campo \"Precio Venta\" es obligatorio.",
                number: "- El campo \"Precio Venta\" debe ser numerico.",
                min: "- El Campo \"Precio Venta\" no puede ser negativo.",

            },
            StockUpdate: {
                required: "- El campo \"Stock\" es obligatorio.",
                number: "- El campo \"Stock\" debe ser numerico.",
                min: "- El Campo \"Stock\" no puede ser negativo.",
                step: "- El Campo \"Stock\" debe ser multiplo de 1."
            }
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
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
                productTable.ajax.reload();
                swal("Buen trabajo!", "Haz creado un nuevo producto!", "success")
            }
            // Sino entonces notificar
            else {
                swal("¡Algo salió mal!", response.message, "error");
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
                productTable.ajax.reload();
                swal("Buen trabajo!", "Haz actualizado el producto!", "success")
            }
            // Sino entonces notificar
            else {
                swal("¡Algo salió mal!", response.message, "error");
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

    // Preguntar antes de eliminar
    swal({
        title: "¿Estás seguro?",
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
                            swal("¡Eliminado!", "Su producto ha sido eliminado.", "success");
                            productTable.ajax.reload();
                        }
                        // Sino Entonces Notificar Error
                        else {
                            if (response.message.includes("\"FK__SaleDetai__Produ__0A9D95DB\"")) {
                                swal("¡Algo salió mal!", "El producto que tratas de eliminar está siendo utilizado. Intenta deshabilitarlo.", "error");
                            }
                            else {
                                swal("¡Algo salió mal!", response.message, "error");
                            }
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
                swal("Cancelado", "Su producto está intacto 😎👍", "error");
            }
        }
    );
}
