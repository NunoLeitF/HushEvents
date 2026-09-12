package com.hushevents.images;

import jakarta.persistence.*;

@Entity
@Table(name = "stored_images")
public class StoredImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private String filename;


    @Column(
            name = "content_type",
            nullable = false
    )
    private String contentType;


    /*
     * IMPORTANT:
     *
     * Do NOT use @Lob here.
     *
     * @Lob causes Hibernate to use ResultSet.getBlob(),
     * which the SQLite JDBC driver does not support.
     *
     * We still tell SQLite to physically store the column
     * as BLOB, but Hibernate handles it as byte[].
     */
    @Column(
            nullable = false,
            columnDefinition = "BLOB"
    )
    private byte[] data;


    public StoredImage() {
    }


    public Long getId() {
        return id;
    }


    public String getFilename() {
        return filename;
    }


    public void setFilename(
            String filename
    ) {
        this.filename =
                filename;
    }


    public String getContentType() {
        return contentType;
    }


    public void setContentType(
            String contentType
    ) {
        this.contentType =
                contentType;
    }


    public byte[] getData() {
        return data;
    }


    public void setData(
            byte[] data
    ) {
        this.data =
                data;
    }
}