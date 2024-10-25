import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    entity.items.map((item) => {
      OrderItemModel.update({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        productId: item.productId
      },
        {
          where: { id: item.id }
        });
    });
    await OrderModel.update(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          productId: item.productId,
          quantity: item.quantity
        })),

      },
      {
        where: {
          id: entity.id,
        },
      },
    );
  }

  async find(id: string): Promise<Order> {
    let orderModel;
    try {
      // orderModel = await OrderModel.findOne({ where: { id } });
      orderModel = await OrderModel.findOne({ where: { id }, include: ["items"], rejectOnEmpty: true });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error("Customer not found");
    }

    if (orderModel) {
      console.log(orderModel)
      const items: OrderItem[] = orderModel.items?.map((item) => (new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)))
      // const items = orderModel.items.map((item)=>({
      //   OrderItem(item.id,item.name,item.price,item.product_id,item.quantity)
      // }))
      const order = new Order(orderModel.id, orderModel.customer_id, items)
      return order
    }
    else
      throw new Error("Erro");

  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: ["items"],
    });

    const orders: Order[] = orderModels.map((orderModel) => {
      const orderItems: OrderItem[] = orderModel.items.map(item => {
        return new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity);
      })
      return new Order(orderModel.id, orderModel.customer_id, orderItems);
    });

    return orders;
  }
}
