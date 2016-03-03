package com.theironyard;

import jodd.json.JsonSerializer;
import spark.Spark;

import java.sql.*;
import java.util.ArrayList;

public class Main {

    public static void createTables(Connection conn) throws SQLException {
        Statement stmt = conn.createStatement();
        stmt.execute("CREATE TABLE IF NOT EXISTS lecturers (id IDENTITY, name VARCHAR, topic VARCHAR, image VARCHAR)");
        stmt.execute("CREATE TABLE IF NOT EXISTS reviews (id IDENTITY, author VARCHAR, text VARCHAR, lecturer_id INT, is_good BOOLEAN)");
    }

    public static int insertLecturer(Connection conn, String name, String topic, String image) throws SQLException {
        PreparedStatement stmt = conn.prepareStatement("INSERT INTO lecturers VALUES (NULL, ?, ?, ?)", Statement.RETURN_GENERATED_KEYS);
        stmt.setString(1, name);
        stmt.setString(2, topic);
        stmt.setString(3, image);
        stmt.execute();

        // return id
        ResultSet rs = stmt.getGeneratedKeys();
        if (rs.next()) {
            return rs.getInt(1);
        }
        return -1;
    }

    public static int insertReview(Connection conn, String author, String text, int lecturerId, boolean isGood) throws SQLException {
        PreparedStatement stmt = conn.prepareStatement("INSERT INTO reviews VALUES (NULL, ?, ?, ?, ?)", Statement.RETURN_GENERATED_KEYS);
        stmt.setString(1, author);
        stmt.setString(2, text);
        stmt.setInt(3, lecturerId);
        stmt.setBoolean(4, isGood);
        stmt.execute();

        // return id
        ResultSet rs = stmt.getGeneratedKeys();
        if (rs.next()) {
            return rs.getInt(1);
        }
        return -1;
    }

    public static Lecturer selectLecturer(Connection conn, int id) throws SQLException {
        PreparedStatement stmt = conn.prepareStatement("SELECT * FROM lecturers WHERE id = ?");
        stmt.setInt(1, id);
        ResultSet results = stmt.executeQuery();
        if (results.next()) {
            Lecturer l = new Lecturer();
            l.id = results.getInt("id");
            l.name = results.getString("name");
            l.topic = results.getString("topic");
            l.image = results.getString("image");
            return l;
        }
        return null;
    }

    public static Review selectReview(Connection conn, int id) throws SQLException {
        PreparedStatement stmt = conn.prepareStatement("SELECT * FROM reviews WHERE id = ?");
        stmt.setInt(1, id);
        ResultSet results = stmt.executeQuery();
        if (results.next()) {
            Review r = new Review();
            r.id = results.getInt("id");
            r.author = results.getString("author");
            r.text = results.getString("text");
            r.lecturerId = results.getInt("lecturer_id");
            r.isGood = results.getBoolean("is_good");
            return r;
        }
        return null;
    }

    public static ArrayList<Lecturer> selectLecturers(Connection conn) throws SQLException {
        ArrayList<Lecturer> lecturers = new ArrayList<>();
        PreparedStatement stmt = conn.prepareStatement("SELECT * FROM lecturers");
        ResultSet results = stmt.executeQuery();
        while (results.next()) {
            Lecturer l = new Lecturer();
            l.id = results.getInt("id");
            l.name = results.getString("name");
            l.topic = results.getString("topic");
            l.image = results.getString("image");
            lecturers.add(l);
        }
        return lecturers;
    }

    public static ArrayList<Review> selectReviews(Connection conn, int lecturerId) throws SQLException {
        ArrayList<Review> reviews = new ArrayList<>();
        PreparedStatement stmt = conn.prepareStatement("SELECT * FROM reviews INNER JOIN lecturers ON lecturers.id = reviews.lecturer_id WHERE lecturers.id = ?");
        stmt.setInt(1, lecturerId);
        ResultSet results = stmt.executeQuery();
        while (results.next()) {
            Review r = new Review();
            r.id = results.getInt("id");
            r.author = results.getString("author");
            r.text = results.getString("text");
            r.lecturerId = results.getInt("lecturer_id");
            r.isGood = results.getBoolean("is_good");
            reviews.add(r);
        }
        return reviews;
    }

    public static void main(String[] args) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:h2:./main");
        createTables(conn);

        Spark.externalStaticFileLocation("public");
        Spark.init();

        Spark.get(
                "/lecturers",
                ((request, response) -> {
                    JsonSerializer s = new JsonSerializer();
                    return s.serialize(selectLecturers(conn));
                })
        );
        Spark.post(
                "/lecturers",
                ((request, response) -> {
                    String name = request.queryParams("name");
                    String topic = request.queryParams("topic");
                    String image = request.queryParams("image");
                    int id = insertLecturer(conn, name, topic, image);
                    JsonSerializer s =  new JsonSerializer();
                    return s.serialize(selectLecturer(conn, id));
                })
        );
        Spark.get(
                "/reviews",
                ((request, response) -> {
                    int lecturerId = Integer.valueOf(request.queryParams("lecturerId"));
                    JsonSerializer s = new JsonSerializer();
                    return s.serialize(selectReviews(conn, lecturerId));
                })
        );
        Spark.post(
                "/reviews",
                ((request, response) -> {
                    String author = request.queryParams("author");
                    String text = request.queryParams("text");
                    int lecturerId = Integer.valueOf(request.queryParams("lecturerId"));
                    boolean isGood = Boolean.valueOf(request.queryParams("isGood"));
                    int id = insertReview(conn, author, text, lecturerId, isGood);
                    JsonSerializer s = new JsonSerializer();
                    return s.serialize(selectReview(conn, id));
                })
        );
    }
}
