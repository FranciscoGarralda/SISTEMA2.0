# 📋 LISTA EXHAUSTIVA DE ERRORES ENCONTRADOS EN EL SISTEMA FINANCIERO

## 📊 RESUMEN EJECUTIVO

**Total de errores encontrados:** ~85+ errores categorizados

**Categorías principales:**
- Errores de Lógica y Cálculos: 15
- Problemas de Rendimiento: 12
- Problemas de Seguridad: 8
- Problemas de Manejo de Errores: 10
- Problemas de Validación: 9
- Problemas de Memoria/Leaks: 7
- Problemas de UX/UI: 11
- Problemas de Mantenibilidad: 8
- Problemas de Consistencia de Datos: 5

---

## 🔴 1. ERRORES DE LÓGICA Y CÁLCULOS

### 1.1 Error en cálculo de días transcurridos (Línea 2370-2372)
**Ubicación:** `calcularDiasDesdeUltimaOperacion()`
**Problema:** La fórmula de cálculo de días tiene un comentario que indica corrección pero la fórmula parece correcta. Sin embargo, puede haber problemas con zonas horarias.
**Impacto:** Los días transcurridos pueden calcularse incorrectamente.
**Código:**
```javascript
const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
```

### 1.2 Error en cálculo de arbitraje - variable no definida (Línea 2672)
**Ubicación:** `calculateArbitraje()`
**Problema:** Se usa `costoReal` sin parsearlo primero con `safeParseFloat()`.
**Impacto:** Puede causar errores de cálculo si `costoReal` es string.
**Código:**
```javascript
formData.cotizacionReal = (costoReal / montoBaseFinal).toFixed(2);
```
**Debería ser:**
```javascript
const costoRealParsed = safeParseFloat(formData.costoReal);
formData.cotizacionReal = (costoRealParsed / montoBaseFinal).toFixed(2);
```

### 1.3 Error en cálculo de total para VENTA con ARS (Línea 2620-2625)
**Ubicación:** `calculateTotal()`
**Problema:** La lógica divide cuando es VENTA con ARS, pero esto puede ser incorrecto según la lógica de negocio. La fórmula puede estar invertida.
**Impacto:** Los totales se calculan incorrectamente en ventas con ARS.

### 1.4 Error en cálculo de saldos - wallet ID con tipo no parseado (Línea 5257-5426)
**Ubicación:** `calcularSaldosWallets()`
**Problema:** Los wallet IDs pueden incluir el tipo (`walletId_tipo`), pero el código accede directamente a `saldos[mov.walletCompra]` sin parsear el ID.
**Impacto:** Los saldos pueden calcularse incorrectamente o no calcularse para wallets con tipo.
**Ejemplo:**
```javascript
if (mov.walletCompra) {
    if (!saldos[mov.walletCompra]) saldos[mov.walletCompra] = {};
    // mov.walletCompra puede ser "W1_efectivo" pero se busca "W1"
}
```

### 1.5 Error en cálculo de comisiones - no valida valores negativos (Línea 2701-2716)
**Ubicación:** `calculateComisionAndTotal()`
**Problema:** No valida que `comisionValor` sea positivo antes de calcular.
**Impacto:** Puede calcular comisiones negativas.

### 1.6 Error en cálculo de préstamo - no valida división por cero (Línea 2632-2637)
**Ubicación:** `calculatePrestamo()`
**Problema:** No valida que `lapso` no sea cero antes de dividir.
**Impacto:** Puede causar `Infinity` o `NaN` si lapso es 0.

### 1.7 Error en normalización de monedas - inconsistencia (Línea 2416-2431)
**Ubicación:** `normalizeMoneda()` y `normalizeAllMonedas()`
**Problema:** Solo normaliza 'PESO' a 'ARS', pero hay otras monedas que pueden necesitar normalización (ej: 'EURO' vs 'EUR').
**Impacto:** Inconsistencias en el manejo de monedas.

### 1.8 Error en cálculo de saldos - no considera pagos mixtos (Línea 5257-5426)
**Ubicación:** `calcularSaldosWallets()`
**Problema:** Cuando `walletCompra` o `walletTC` es `'pago_mixto'`, el código intenta calcular saldos sobre un ID que no existe.
**Impacto:** Errores al calcular saldos cuando hay pagos mixtos.

### 1.9 Error en cálculo de balances de cuentas corrientes - lógica invertida (Línea 5568-5584)
**Ubicación:** `calcularBalancesCuentasCorrientes()`
**Problema:** En COMPRA y VENTA, resta del balance cuando debería sumar o viceversa según la lógica de negocio. Los comentarios dicen "me debe" pero la operación puede estar invertida.
**Impacto:** Los balances de cuentas corrientes pueden estar invertidos.

### 1.10 Error en cálculo de profit en arbitraje - no valida valores (Línea 2678-2683)
**Ubicación:** `calculateArbitraje()`
**Problema:** Calcula profit sin validar que los valores sean positivos.
**Impacto:** Puede mostrar profit negativo o incorrecto.

### 1.11 Error en formateo de números - puede perder precisión (Línea 2581-2602)
**Ubicación:** `formatNumberWithThousands()`
**Problema:** Usa `toLocaleString()` que puede tener problemas de precisión con números muy grandes o muy pequeños.
**Impacto:** Pérdida de precisión en números grandes.

### 1.12 Error en parseo de números - no maneja notación científica (Línea 2552-2579)
**Ubicación:** `safeParseFloat()`
**Problema:** No maneja números en notación científica (ej: "1e5").
**Impacto:** Puede fallar al parsear números científicos.

### 1.13 Error en cálculo de totales - no valida moneda vacía (Línea 2604-2630)
**Ubicación:** `calculateTotal()`
**Problema:** No valida que `moneda` no esté vacía antes de calcular.
**Impacto:** Puede calcular totales con moneda inválida.

### 1.14 Error en cálculo de días - problemas con zona horaria (Línea 2365-2374)
**Ubicación:** `calcularDiasDesdeUltimaOperacion()`
**Problema:** No normaliza las fechas a la misma zona horaria antes de calcular la diferencia.
**Impacto:** Puede calcular días incorrectos según la zona horaria del usuario.

### 1.15 Error en cálculo de saldos - no considera movimientos anulados en algunos casos (Línea 5239)
**Ubicación:** `calcularSaldosWallets()`
**Problema:** Filtra movimientos anulados al inicio, pero si un movimiento se anula después de calcular saldos, los saldos pueden quedar inconsistentes.
**Impacto:** Saldos inconsistentes si se anulan movimientos.

---

## ⚡ 2. PROBLEMAS DE RENDIMIENTO

### 2.1 Re-renderizado completo en cada cambio (Múltiples ubicaciones)
**Problema:** Cada cambio en el formulario causa re-renderizado completo usando `innerHTML`.
**Impacto:** Pérdida de foco, parpadeos, bajo rendimiento.
**Solución:** Usar actualizaciones incrementales del DOM.

### 2.2 Búsqueda lineal de clientes en cada renderizado (Línea 2922)
**Ubicación:** `renderOperationsModule()`
**Problema:** `getClientes().map()` se ejecuta en cada renderizado.
**Impacto:** Lento con muchos clientes.

### 2.3 Búsqueda lineal de wallets en cada renderizado (Línea 3529)
**Ubicación:** `initWalletButtons()`
**Problema:** `getWallets()` se llama múltiples veces y se itera en cada renderizado.
**Impacto:** Lento con muchas wallets.

### 2.4 Cálculo de saldos completo en cada renderizado (Línea 5237-5430)
**Ubicación:** `calcularSaldosWallets()`
**Problema:** Recalcula todos los saldos desde cero cada vez, incluso si no hay cambios.
**Impacto:** Muy lento con muchos movimientos.
**Solución:** Cachear resultados y recalcular solo cuando hay cambios.

### 2.5 Filtrado de movimientos múltiples veces (Línea 4733-4741)
**Ubicación:** `renderPendientesList()`
**Problema:** Filtra movimientos pendientes cada vez que se renderiza.
**Impacto:** Lento con muchos movimientos.

### 2.6 Múltiples llamadas a `getMovimientos()` (Múltiples ubicaciones)
**Problema:** `getMovimientos()` se llama múltiples veces en la misma función sin cachear.
**Impacto:** Múltiples lecturas de localStorage innecesarias.

### 2.7 Formateo de números en cada renderizado (Línea 2477-2487)
**Ubicación:** `formatNumericFields()`
**Problema:** Formatea todos los campos numéricos incluso si no cambiaron.
**Impacto:** Trabajo innecesario.

### 2.8 Event listeners duplicados potenciales (Múltiples ubicaciones)
**Problema:** Aunque hay código para limpiar listeners, algunos pueden acumularse si hay errores.
**Impacto:** Múltiples ejecuciones del mismo handler.

### 2.9 Debounce no aplicado a todos los inputs (Línea 2534-2545)
**Ubicación:** `debounceFormat()`
**Problema:** Solo se usa para formateo, pero no para validaciones o cálculos.
**Impacto:** Cálculos excesivos mientras el usuario escribe.

### 2.10 innerHTML masivo en renderizado de listas (Línea 4395-4495)
**Ubicación:** `renderMovimientosList()`
**Problema:** Construye HTML completo con `map().join('')` para listas grandes.
**Impacto:** Bloqueo del hilo principal con listas grandes.
**Solución:** Virtualización o paginación.

### 2.11 No hay límite de movimientos mostrados (Línea 4395)
**Ubicación:** `renderMovimientosList()`
**Problema:** Muestra todos los movimientos sin paginación.
**Impacto:** Puede renderizar miles de elementos.

### 2.12 Cálculo de balances sin optimización (Línea 5533-5590)
**Ubicación:** `calcularBalancesCuentasCorrientes()`
**Problema:** Recalcula todos los balances desde cero cada vez.
**Impacto:** Lento con muchos movimientos.

---

## 🔒 3. PROBLEMAS DE SEGURIDAD

### 3.1 XSS potencial en escapeHTML incompleto (Línea 2460-2465)
**Ubicación:** `escapeHTML()`
**Problema:** Usa `textContent` que es seguro, pero hay lugares donde se usa directamente `innerHTML` con datos del usuario.
**Impacto:** Posible XSS si hay datos maliciosos.

### 3.2 Datos sensibles en localStorage sin encriptar (Múltiples ubicaciones)
**Problema:** Todos los datos financieros se almacenan en localStorage sin encriptar.
**Impacto:** Datos accesibles a cualquier script en la página.

### 3.3 No hay validación de entrada en formularios (Múltiples ubicaciones)
**Problema:** Los inputs aceptan cualquier valor sin validación del lado del cliente.
**Impacto:** Datos inválidos pueden corromper la base de datos.

### 3.4 No hay sanitización de IDs de wallets (Línea 3627)
**Ubicación:** `initWalletManagement()`
**Problema:** El ID de wallet se toma directamente del input sin sanitizar.
**Impacto:** Puede contener caracteres especiales que rompan el código.

### 3.5 No hay validación de tamaño de datos antes de guardar (Línea 2074-2080)
**Ubicación:** `safeLocalStorageOperation()`
**Problema:** Aunque hay verificación de tamaño, se hace después de convertir a string, lo que puede ser costoso.
**Impacto:** Puede fallar con datos grandes.

### 3.6 No hay rate limiting en operaciones (Múltiples ubicaciones)
**Problema:** No hay límite en la frecuencia de guardado de datos.
**Impacto:** Puede saturar localStorage rápidamente.

### 3.7 No hay validación de tipos de datos (Múltiples ubicaciones)
**Problema:** No valida que los datos sean del tipo esperado antes de guardar.
**Impacto:** Puede guardar datos corruptos.

### 3.8 No hay protección contra inyección en IDs (Múltiples ubicaciones)
**Problema:** Los IDs se usan directamente en queries sin validar formato.
**Impacto:** Posible manipulación de datos.

---

## 🛡️ 4. PROBLEMAS DE MANEJO DE ERRORES

### 4.1 Errores silenciados en múltiples lugares (Múltiples ubicaciones)
**Problema:** Muchos `try-catch` solo hacen `console.error()` sin notificar al usuario.
**Impacto:** El usuario no sabe cuando algo falla.

### 4.2 No hay manejo de errores en cálculos (Línea 2604-2630)
**Ubicación:** `calculateTotal()`
**Problema:** No maneja errores si los valores son inválidos.
**Impacto:** Puede mostrar `NaN` o `Infinity` al usuario.

### 4.3 No hay validación de existencia de elementos antes de usar (Múltiples ubicaciones)
**Problema:** Aunque hay `safeGetElementById()`, muchos lugares usan `document.getElementById()` directamente.
**Impacto:** Puede causar errores si el elemento no existe.

### 4.4 No hay manejo de errores en parseo de JSON (Línea 2138)
**Ubicación:** `loadFormState()`
**Problema:** Aunque hay try-catch, no valida que el JSON sea válido antes de parsear.
**Impacto:** Puede fallar con JSON corrupto.

### 4.5 No hay manejo de errores en operaciones de fecha (Línea 3245-3258)
**Ubicación:** `initOperationsModule()`
**Problema:** El manejo de errores de fecha es básico.
**Impacto:** Puede fallar con fechas inválidas.

### 4.6 No hay manejo de errores en localStorage lleno (Línea 2088-2120)
**Ubicación:** `safeLocalStorageOperation()`
**Problema:** Aunque intenta limpiar, puede fallar si el problema persiste.
**Impacto:** Puede perder datos si localStorage se llena.

### 4.7 No hay rollback en caso de error al guardar (Múltiples ubicaciones)
**Problema:** Si falla el guardado, los datos pueden quedar inconsistentes.
**Impacto:** Pérdida de datos o estado inconsistente.

### 4.8 No hay validación de datos antes de calcular saldos (Línea 5237)
**Ubicación:** `calcularSaldosWallets()`
**Problema:** No valida que los movimientos tengan la estructura correcta.
**Impacto:** Puede fallar con datos corruptos.

### 4.9 No hay manejo de errores en renderizado (Múltiples ubicaciones)
**Problema:** Si falla el renderizado, la aplicación puede quedar en estado inconsistente.
**Impacto:** UI rota o datos no mostrados.

### 4.10 No hay logging estructurado (Múltiples ubicaciones)
**Problema:** Solo usa `console.error()` sin estructura.
**Impacto:** Difícil debuggear problemas en producción.

---

## ✅ 5. PROBLEMAS DE VALIDACIÓN

### 5.1 No valida que los montos sean positivos (Múltiples ubicaciones)
**Problema:** Acepta montos negativos sin validar.
**Impacto:** Puede crear movimientos con montos inválidos.

### 5.2 No valida que las fechas sean válidas (Línea 2443-2447)
**Ubicación:** `isValidDate()`
**Problema:** La validación es básica y puede aceptar fechas inválidas.
**Impacto:** Puede guardar fechas incorrectas.

### 5.3 No valida que los clientes existan antes de usar (Línea 2338-2343)
**Ubicación:** `getClienteNombre()`
**Problema:** Retorna 'Cliente no encontrado' pero no valida antes de guardar.
**Impacto:** Puede guardar movimientos con clientes inválidos.

### 5.4 No valida que las wallets existan antes de usar (Línea 2351-2357)
**Ubicación:** `getWalletNombre()`
**Problema:** Similar al anterior.
**Impacto:** Puede guardar movimientos con wallets inválidas.

### 5.5 No valida formato de email (Línea 4024)
**Ubicación:** `renderClientesModule()`
**Problema:** Usa `type="email"` pero no valida el formato realmente.
**Impacto:** Puede guardar emails inválidos.

### 5.6 No valida que los tipos de cambio sean positivos (Línea 2613)
**Ubicación:** `calculateTotal()`
**Problema:** Solo valida que no sea cero, pero acepta negativos.
**Impacto:** Puede calcular totales negativos.

### 5.7 No valida que los porcentajes estén en rango 0-100 (Línea 2706)
**Ubicación:** `calculateComisionAndTotal()`
**Problema:** No valida que el porcentaje de comisión esté entre 0 y 100.
**Impacto:** Puede calcular comisiones incorrectas.

### 5.8 No valida unicidad de IDs de wallets (Línea 3633)
**Ubicación:** `initWalletManagement()`
**Problema:** Valida duplicados pero no valida formato del ID.
**Impacto:** Puede crear wallets con IDs inválidos.

### 5.9 No valida que los campos requeridos estén presentes (Línea 3464-3493)
**Ubicación:** `form._submitHandler`
**Problema:** Solo valida algunos campos, no todos los requeridos.
**Impacto:** Puede guardar movimientos incompletos.

---

## 💾 6. PROBLEMAS DE MEMORIA Y LEAKS

### 6.1 Event listeners no siempre limpiados (Múltiples ubicaciones)
**Problema:** Aunque hay código para limpiar, algunos listeners pueden quedar si hay errores.
**Impacto:** Memory leaks con el tiempo.

### 6.2 Referencias a elementos DOM mantenidas (Múltiples ubicaciones)
**Problema:** Algunas funciones mantienen referencias a elementos DOM.
**Impacto:** Los elementos no se pueden garbage collect.

### 6.3 Timeouts e intervals acumulados (Línea 2506-2532)
**Ubicación:** Sistema de timeouts
**Problema:** Aunque hay limpieza, puede haber acumulación si hay errores.
**Impacto:** Múltiples timers ejecutándose.

### 6.4 Datos en memoria sin límite (Línea 2292-2315)
**Ubicación:** `addMovimiento()`
**Problema:** Limita a 1000 movimientos, pero los datos antiguos se eliminan sin confirmación.
**Impacto:** Puede perder datos históricos.

### 6.5 Cache de formData sin límite (Línea 2127-2132)
**Ubicación:** `saveFormState()`
**Problema:** Guarda el estado del formulario sin límite de tamaño.
**Impacto:** Puede llenar localStorage.

### 6.6 Referencias circulares potenciales (Múltiples ubicaciones)
**Problema:** Los objetos pueden tener referencias circulares que impiden garbage collection.
**Impacto:** Memory leaks.

### 6.7 Closures que mantienen referencias grandes (Múltiples ubicaciones)
**Problema:** Los event handlers pueden mantener referencias a objetos grandes.
**Impacto:** Memory leaks.

---

## 🎨 7. PROBLEMAS DE UX/UI

### 7.1 Pérdida de foco al re-renderizar (Múltiples ubicaciones)
**Problema:** Al usar `innerHTML`, se pierde el foco del input.
**Impacto:** Mala experiencia de usuario al escribir.

### 7.2 No hay feedback visual durante guardado (Múltiples ubicaciones)
**Problema:** No muestra indicador de carga al guardar.
**Impacto:** El usuario no sabe si se está guardando.

### 7.3 Mensajes de error poco claros (Múltiples ubicaciones)
**Problema:** Los mensajes de error son técnicos o poco descriptivos.
**Impacto:** El usuario no entiende qué salió mal.

### 7.4 No hay confirmación antes de acciones destructivas (Algunas ubicaciones)
**Problema:** Algunas acciones destructivas no piden confirmación.
**Impacto:** Puede eliminar datos por error.

### 7.5 No hay deshacer/rehacer (Múltiples ubicaciones)
**Problema:** No hay sistema de deshacer para acciones.
**Impacto:** No se pueden revertir errores.

### 7.6 No hay validación en tiempo real (Múltiples ubicaciones)
**Problema:** Solo valida al enviar, no mientras se escribe.
**Impacto:** El usuario no sabe si hay errores hasta enviar.

### 7.7 No hay ayuda contextual (Múltiples ubicaciones)
**Problema:** No hay tooltips o ayuda para campos complejos.
**Impacto:** El usuario puede no entender cómo usar ciertas funciones.

### 7.8 No hay indicador de campos requeridos (Algunas ubicaciones)
**Problema:** No todos los campos requeridos están claramente marcados.
**Impacto:** El usuario puede dejar campos vacíos.

### 7.9 No hay feedback al eliminar datos (Línea 2215-2219)
**Ubicación:** `deleteWallet()`
**Problema:** Elimina sin mostrar qué se eliminó.
**Impacto:** El usuario puede no saber qué se eliminó.

### 7.10 No hay paginación en listas grandes (Múltiples ubicaciones)
**Problema:** Muestra todos los elementos sin paginación.
**Impacto:** Lento y difícil de navegar con muchos datos.

### 7.11 No hay búsqueda/filtrado en listas (Múltiples ubicaciones)
**Problema:** No hay forma de buscar o filtrar en listas grandes.
**Impacto:** Difícil encontrar elementos específicos.

---

## 🔧 8. PROBLEMAS DE MANTENIBILIDAD

### 8.1 Código duplicado en múltiples lugares (Múltiples ubicaciones)
**Problema:** Lógica similar repetida en diferentes funciones.
**Impacto:** Difícil mantener y propenso a errores.

### 8.2 Funciones muy largas (Múltiples ubicaciones)
**Problema:** Algunas funciones tienen más de 100 líneas.
**Impacto:** Difícil de entender y mantener.

### 8.3 Nombres de variables poco descriptivos (Múltiples ubicaciones)
**Problema:** Variables como `m`, `mov`, `w` son poco descriptivas.
**Impacto:** Código difícil de leer.

### 8.4 Magic numbers sin constantes (Múltiples ubicaciones)
**Problema:** Números mágicos como `1000`, `500`, `0.01` sin constantes.
**Impacto:** Difícil cambiar valores sin buscar en todo el código.

### 8.5 Comentarios desactualizados (Algunas ubicaciones)
**Problema:** Algunos comentarios no reflejan el código actual.
**Impacto:** Confusión al leer el código.

### 8.6 No hay documentación de funciones complejas (Múltiples ubicaciones)
**Problema:** Funciones complejas no tienen documentación JSDoc.
**Impacto:** Difícil entender qué hace cada función.

### 8.7 Lógica de negocio mezclada con UI (Múltiples ubicaciones)
**Problema:** La lógica de cálculo está mezclada con el renderizado.
**Impacto:** Difícil testear y mantener.

### 8.8 No hay separación de concerns (Múltiples ubicaciones)
**Problema:** Todo está en un solo archivo HTML.
**Impacto:** Difícil mantener y escalar.

---

## 📊 9. PROBLEMAS DE CONSISTENCIA DE DATOS

### 9.1 Normalización de monedas inconsistente (Línea 2416-2431)
**Problema:** No normaliza todas las monedas de la misma forma.
**Impacto:** Inconsistencias en los datos.

### 9.2 Formato de fechas inconsistente (Múltiples ubicaciones)
**Problema:** Usa diferentes formatos de fecha en diferentes lugares.
**Impacto:** Puede causar problemas al comparar fechas.

### 9.3 IDs generados de forma inconsistente (Múltiples ubicaciones)
**Problema:** Algunos IDs usan `generateUUID()`, otros usan prefijos diferentes.
**Impacto:** Puede haber colisiones o IDs inconsistentes.

### 9.4 Estructura de datos inconsistente (Múltiples ubicaciones)
**Problema:** Los objetos de movimientos pueden tener campos diferentes según el tipo.
**Impacto:** Difícil validar y procesar datos.

### 9.5 No hay migración de datos (Múltiples ubicaciones)
**Problema:** Si cambia la estructura de datos, los datos antiguos pueden quedar incompatibles.
**Impacto:** Puede perder datos al actualizar.

---

## 🎯 PRIORIZACIÓN DE ERRORES

### 🔴 CRÍTICOS (Resolver inmediatamente)
1. Error en cálculo de saldos - wallet ID con tipo no parseado (#1.4)
2. Error en cálculo de balances de cuentas corrientes (#1.9)
3. XSS potencial (#3.1)
4. No hay validación de entrada (#3.3)
5. Errores silenciados (#4.1)

### 🟡 IMPORTANTES (Resolver pronto)
6. Error en cálculo de arbitraje (#1.2)
7. Re-renderizado completo (#2.1)
8. Cálculo de saldos sin optimización (#2.4)
9. No valida montos positivos (#5.1)
10. Memory leaks potenciales (#6.1)

### 🟢 MEJORAS (Resolver cuando sea posible)
11. Pérdida de foco al re-renderizar (#7.1)
12. Código duplicado (#8.1)
13. No hay paginación (#7.10)
14. No hay búsqueda/filtrado (#7.11)
15. Documentación faltante (#8.6)

---

## 📝 NOTAS ADICIONALES

- El sistema está bien estructurado en general, pero necesita refactorización en algunas áreas.
- La mayoría de los errores son de lógica y validación, no de sintaxis.
- Hay buen manejo de errores en algunos lugares, pero falta consistencia.
- El código tiene buenas prácticas en algunos aspectos (como escapeHTML), pero falta aplicarlas consistentemente.
- El sistema es funcional pero necesita mejoras en rendimiento y validación.

---

**Fecha de análisis:** $(date)
**Versión del sistema analizada:** 1.0.0
**Total de líneas analizadas:** ~5,784

