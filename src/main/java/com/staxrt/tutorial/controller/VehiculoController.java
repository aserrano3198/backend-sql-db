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

package com.staxrt.tutorial.controller;

import com.staxrt.tutorial.exception.ResourceNotFoundException;

// import java.io.Console;
import java.sql.Timestamp;

import com.staxrt.tutorial.model.Tarifas;
import com.staxrt.tutorial.model.Vehiculo;
import com.staxrt.tutorial.model.Viajes;
import com.staxrt.tutorial.repository.VehiculoRepository;
import com.staxrt.tutorial.repository.ViajesRepository;
import com.staxrt.tutorial.repository.TarifasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// import javax.validation.Valid;
// import java.util.Date;
// import java.util.HashMap;
import java.util.List;
// import java.util.Map;

/**
 * The type Vehiculo controller.
 *
 * @author Givantha Kalansuriya
 */
@RestController
@RequestMapping("/api/v1")
public class VehiculoController {

  @Autowired
  private VehiculoRepository vehiculoRepository;
  @Autowired
  private ViajesRepository viajesRepository;
  @Autowired
  private TarifasRepository tarifasRepository;

  /**
   * Get all vehiculos list.
   *
   * @return the list
   */
  @GetMapping("/vehiculos")
  public List<Vehiculo> getAllVehiculos() {
    return vehiculoRepository.findAll();
  }

  /**
   * Get vehiculo by id.
   *
   * @param vehiculoId the vehiculo id
   * @return the vehiculos by id
   * @throws ResourceNotFoundException the resource not found exception
   */
  @GetMapping("/vehiculo/{id}")
  public Vehiculo getVehiculoInfo(@PathVariable(value = "id") Long vehiculoId) throws ResourceNotFoundException {
    Vehiculo vehiculo = vehiculoRepository
        .findById(vehiculoId)
        .orElseThrow(() -> new ResourceNotFoundException("Vehiculo not found on :: " + vehiculoId));
    return vehiculo;
  }

  @PostMapping("/vehiculo/{tipo}/{latitud}/{longitud}/{libre}/{aparcadoOK}")
  public void addVMPs(
      @PathVariable(value = "tipo") String tipo,
      @PathVariable(value = "latitud") Double latitud,
      @PathVariable(value = "longitud") Double longitud,
      @PathVariable(value = "libre") boolean libre,
      @PathVariable(value = "aparcadoOK") boolean aparcadoOK) {
    System.out.println("hello");
    Vehiculo vehiculo = new Vehiculo(tipo, latitud, longitud, libre, aparcadoOK);
    vehiculoRepository.save(vehiculo);
  }

  /**
   * Get vehiculo by id.
   *
   * @param vehiculoId the vehiculo id
   * @return the vehiculos by id
   * @throws ResourceNotFoundException the resource not found exception
   */
  @GetMapping("/vehiculo/{id}/{user_id}")
  public ResponseEntity<Viajes> getVehiculo(@PathVariable(value = "id") Long vehiculoId,
      @PathVariable(value = "user_id") Long userId) throws ResourceNotFoundException {
    Vehiculo vehiculo = vehiculoRepository
        .findById(vehiculoId)
        .orElseThrow(() -> new ResourceNotFoundException("Vehiculo not found on :: " + vehiculoId));

    Viajes viaje = viajesRepository
        .findById(vehiculo.getIdViajeEnCurso())
        .orElseThrow(() -> new ResourceNotFoundException("Viaje not found on :: " + vehiculo.getIdViajeEnCurso()));

    List<Tarifas> tarifas = tarifasRepository.findAll();
    Timestamp timestampnow = new Timestamp(System.currentTimeMillis());
    Long tiempoAlquiler = vehiculo.getTiempoAlquilado();

    float diff = timestampnow.getTime() - tiempoAlquiler;
    float tiempoSec = diff / 1000;
    viaje.setTiempo(tiempoSec);
    if (vehiculo.getTipo() == "bike") {
      viaje.setCoste(tarifas.get(0).getTarifa() * (diff / 60000));
    } else {
      viaje.setCoste(tarifas.get(1).getTarifa() * (diff / 60000));
    }
    viaje.setUserId(userId);
    vehiculo.setLibre(true);
    vehiculo.setTiempoAlquilado(0);
    vehiculoRepository.save(vehiculo);
    final Viajes updatedViaje = viajesRepository.save(viaje);
    return ResponseEntity.ok(updatedViaje);
  }

  @PutMapping("/vehiculo/{id}")
  public ResponseEntity<Vehiculo> cogerVehiculosById(@PathVariable(value = "id") Long vehiculoId)
      throws ResourceNotFoundException {
    Vehiculo vehiculo = vehiculoRepository
        .findById(vehiculoId)
        .orElseThrow(() -> new ResourceNotFoundException("Vehiculo not found on :: " + vehiculoId));

    Timestamp timestamp = new Timestamp(System.currentTimeMillis());
    vehiculo.setTiempoAlquilado(timestamp.getTime());
    vehiculo.setLibre(false);

    Viajes newViaje = new Viajes(timestamp, vehiculo.getLatitud(), vehiculo.getLongitud());

    viajesRepository.save(newViaje);
    vehiculo.setIdViajeEnCurso(newViaje.getId());

    final Vehiculo updatedVehiculo = vehiculoRepository.save(vehiculo);
    return ResponseEntity.ok(updatedVehiculo);
  }

  @DeleteMapping("/vehiculo/{id}")
  public void deleteVehiculo(@PathVariable(value = "id") Long vehiculoId) throws ResourceNotFoundException {
    Vehiculo vehiculo = vehiculoRepository
        .findById(vehiculoId)
        .orElseThrow(() -> new ResourceNotFoundException("Vehiculo not found on :: " + vehiculoId));
    vehiculoRepository.delete(vehiculo);
  }

  @PostMapping("/vehiculo/{id}")
  public ResponseEntity<Vehiculo> changeAparcadoOk(@PathVariable(value = "id") Long vehiculoId)
      throws ResourceNotFoundException {
    Vehiculo vehiculo = vehiculoRepository
        .findById(vehiculoId)
        .orElseThrow(() -> new ResourceNotFoundException("Vehiculo not found on :: " + vehiculoId));
    vehiculo.setAparcadoOk(false);
    vehiculoRepository.save(vehiculo);
    final Vehiculo updatedVehiculo = vehiculoRepository.save(vehiculo);
    return ResponseEntity.ok(updatedVehiculo);
  }
}
