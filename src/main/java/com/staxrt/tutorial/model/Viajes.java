/*
 *
 *  Copyright (c) 2018-2020 Givantha Kalansuriya, This source is a part of
 *   Staxrt - sample application source code.
 *   http://staxrt.com
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */

// package com.staxrt.tutorial.model;

// import org.springframework.data.jpa.domain.support.AuditingEntityListener;

// import javax.persistence.*;
// import java.sql.Timestamp;

// /**
//  * The type Viajes.
//  *
//  * @author Givantha Kalansuriya
//  */
// @Entity
// @Table(name = "viajes")
// @EntityListeners(AuditingEntityListener.class)
// public class Viajes {

//     @Id
// 	@GeneratedValue(strategy = GenerationType.IDENTITY)
//     private long id_viaje;

//     @ManyToOne
//     @JoinColumn(name="user_id")
//     private User user;

//     @Column(name = "fecha", nullable = false)
//     private Timestamp fecha;

//     @Column(name = "tiempo", nullable = false)
//     private long tiempo;

//     @Column(name = "longitudinicio", nullable = false)
//     private long longitudinicio;

//     @Column(name = "latitudinicio", nullable = false)
//     private long latitudinicio;

//     @Column(name = "longitudfinal", nullable = false)
//     private long longitudfinal;

//     @Column(name = "latitudfinal", nullable = false)
//     private long latitudfinal;


//     public Viajes() {

//     }
    
//     //implementar getters y setters

// }

// /* use users_database;
// SHOW TABLES;
// SELECT * FROM users;
// */
