alter table productos add constraint fk_id_rubro foreign key (id_rubro) references rubros(id_rubro);

drop table productos;

create table productos(
id_productos int not null primary key auto_increment,
descripcion varchar(80),
precio decimal(15,2),
URLImagen varchar(120),
id_rubro int not null
);

alter table productos add constraint fk_id_rubro foreign key (id_rubro) references rubros(id_rubro);

insert into productos (descripcion,precio,URLImagen,id_rubro)
values ('Acrilico EQ azul ultramar',600,'/Front/img/acrilico_eq_azul_ceruleo.jpg',1),
('Pincel liner 000',1500,'/Front/img/pincel_liner.jpg',1),
('Mod Podge x 100 cc.',2500,'/Front/img/mod_podge.jpg',1),
('Base Líquida Maybelline Matte Poreless 118 Light Beige',25000,'/Front/img/base_fit.jpeg',2),
('Delineador Líquido Maybelline Black Matte x 1 g',20630,'/Front/img/delinador_liquido.jpg',2),
('Maybelline Máscara De Pestañas Waterproof',23000,'/Front/img/mascara_pestanas.jpg',2),
('Bolsa camiseta 40X50',2630.03,'/Front/img/bolsa_camiseta.jpg',3),
('Vaso plastico 110 cc x 100u.',3100,'/Front/img/vaso_plastico_110.jpg',3),
('Bandeja cartón blanca reforzada 17x14 x 100u.',4900,'/Front/img/bandeja_carton.png',3);

select * from productos;



