import { Controller, Get, Query, Param, Post, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppService } from './app.service';
import { Venta } from './venta.entity';
import * as fs from 'fs';
import * as path from 'path';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectRepository(Venta)
    private readonly ventaRepo: Repository<Venta>,
  ) { }

  private getProducts() {
    const filePath = path.join(__dirname, '..', 'products.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data).products;
  }

  private getSales() {
    return this.ventaRepo.find();
  }

  private saveSale(sale: any) {
    const filePath = path.join(__dirname, 'sales.json');
    let sales = [];
    if (fs.existsSync(filePath)) {
      sales = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    sales.push(sale);
    fs.writeFileSync(filePath, JSON.stringify(sales, null, 2));
  }

  // /api/items?q=busqueda
  @Get('api/items')
  buscarItems(@Query('q') query: string) {
    const productos = this.getProducts();
    if (!query) return productos;
    const q = query.toLowerCase();
    return productos.filter((p: any) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  }

  // /api/items/:id
  @Get('api/items/:id')
  obtenerItem(@Param('id') id: string) {
    const productos = this.getProducts();
    return productos.find((p: any) => p.id === Number(id));
  }

  // /api/addSale
  @Post('api/addSale')
  async agregarVenta(@Body() body: any) {
    // body: { productoId, cantidad, datosUsuario }
    const productos = this.getProducts();
    const producto = productos.find((p: any) => p.id === Number(body.productoId));
    if (!producto) return { ok: false };
    const venta = this.ventaRepo.create({
      productoId: producto.id,
      cantidad: body.cantidad || 1,
      datosUsuario: body.datosUsuario || null,
      producto
    });
    await this.ventaRepo.save(venta);
    return { ok: true };
  }

  // /api/sales
  @Get('api/sales')
  async obtenerVentas() {
    return await this.ventaRepo.find({ order: { fecha: 'DESC' } });
  }
}
