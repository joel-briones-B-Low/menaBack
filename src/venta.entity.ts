import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Venta {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    productoId: number;

    @Column({ type: 'int', default: 1 })
    cantidad: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    fecha: Date;

    @Column({ type: 'jsonb', nullable: true })
    datosUsuario: any;

    @Column({ type: 'jsonb' })
    producto: any;
}