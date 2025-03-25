# Sistema Ropa

procedimientos del back 
Se creo la base de datos y se agrego el backend con una api de productos 
que se pruede crear producto 
obtener productos y por su id
modificar productos por id
eliminar productos por su id 

dia 2
agregar nueva categoria 
modificar categoria por su id 
editar categoria
obs 
tabla de productos falta el nombre de la categoria (modificar en ese caso)

posibles mejoras en categorias (mejorado)
Permitir eliminar categorías, pero asignar los productos a una "Categoría por defecto"
Se crea una categoría especial, por ejemplo "Sin categoría" (id = 1).

Antes de eliminar una categoría, actualizamos los productos de esa categoría para que usen categoria_id = 1.

🔹 Ventaja: No se pierden productos.
🔹 Desventaja: Hay que definir claramente qué pasa con estos productos después.

SQL para actualizar antes de eliminar:

UPDATE productos SET categoria_id = 1 WHERE categoria_id = ?;
DELETE FROM categorias WHERE id = ?;
