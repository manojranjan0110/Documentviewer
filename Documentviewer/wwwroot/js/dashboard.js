$(document).ready(function () {
    var pdfModal = new bootstrap.Modal($('#pdfModal')[0]);
    var $pdfFrame = $('#pdfFrame');

    $(document).on('click', '.btn-view', function () {
        var fileName = $(this).data('filename');
        var pdfPath = '/Documents/' + encodeURIComponent(fileName);
        $pdfFrame.attr('src', pdfPath);
        pdfModal.show();
    });

    $('#pdfModal').on('hidden.bs.modal', function () {
        $pdfFrame.attr('src', '');
    });

    function loadDocuments(data) {
        const tbody = $("#documentTable tbody");
        tbody.empty();

        if (data.length === 0) {
            $("#noResults").show();
            $("#documentTable").hide();
            return;
        }

        $("#noResults").hide();
        $("#documentTable").show();

        $.each(data, function (i, doc) {
            const row = `<tr>
                        <td>${doc.fileName}</td>
                        <td>${new Date(doc.uploadedOn).toLocaleDateString()}</td>
                          <td>
                            <button class="btn btn-link btn-view" data-filename="${doc.fileName}">View</button>
                        </td>
                    </tr>`;
            tbody.append(row);
        });
    }

    $("#searchBtn").on("click", function () {
        const keyword = $("#keyword").val();
        $.getJSON(`/Document/Search?keyword=${encodeURIComponent(keyword)}`, function (data) {
            loadDocuments(data);
        });
    });

    $("#resetBtn").on("click", function () {
        $("#keyword").val('');
        $.getJSON(`/Document/Search`, function (data) {
            loadDocuments(data);
        });
    });

});