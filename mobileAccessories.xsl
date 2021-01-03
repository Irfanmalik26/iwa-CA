<?xml version="1.0" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:template match="/">
        <table class="table table-hover table-bordered text-center" id="products-table">
            <thead>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Update</th>
                <th>Delete</th>
            </thead>
            <tbody>
                <xsl:for-each select="/accessories/product">
                    <tr>
                        <td>
                            <xsl:value-of select="id" />
                        </td>
                        <td>
                            <xsl:value-of select="name" />
                        </td>
                        <td>
                            <xsl:value-of select="description" />
                        </td>
                        <td>
                            <xsl:value-of select="price" />
                        </td>
                        <td>
                            <a href="#" onclick='updateProduct(`{position()}`)'>
                                <i class="fas fa-edit blue" title="Update Product"></i>
                            </a>
                        </td>
                        <td>
                            <a href="#"  onclick='deleteProduct(`{position()}`)'>
                                <i class="fas fa-trash red" title="Delete Product"></i>
                            </a>
                        </td>
                    </tr>
                </xsl:for-each>
            </tbody>
        </table>
    </xsl:template>
</xsl:stylesheet>