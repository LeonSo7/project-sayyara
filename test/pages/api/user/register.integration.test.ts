/**
 *
 * User Registration Flow Integration Tests
 *
 * @group integration
 */

import registerCustomerHandler from "@pages/api/user/register/customer";
import registerEmployeeHandler from "@pages/api/user/register/employee";
import registerShopOwnerHandler from "@pages/api/user/register/shopOwner";
import {
  CustomerWithVehiclesType,
  Employee,
  EmployeeWithShopType,
  prisma,
} from "@server/db/client";
import { createMockRequestResponse } from "@test/mocks/mockRequestResponse";

const testEmployee: Employee = {
  id: "",
  first_name: "employee_first_name",
  last_name: "employee_last_name",
  phone_number: "1234567890",
  email: "employee@test.com",
  password: "test_PASSWORD11",
  image: null,
  create_time: new Date(),
  update_time: new Date(),
  type: "EMPLOYEE",
  shop_id: "shop_id",
  status: "ACTIVE",
};

const testShopOwner: EmployeeWithShopType = {
  id: "",
  first_name: "shop_owner_first_name",
  last_name: "shop_owner_last_name",
  phone_number: "1234567890",
  email: "shop_owner@test.com",
  password: "test_PASSWORD11",
  image: null,
  create_time: new Date(),
  update_time: new Date(),
  type: "SHOP_OWNER",
  status: "ACTIVE",
  shop_id: "shop_id",
  shop: {
    id: "shop_id",
    create_time: new Date(),
    update_time: new Date(),
    name: "test_shop_name",
    address: "test_address",
    phone_number: "1234567890",
    email: "test@email.com",
    postal_code: "A1A 1A1",
    city: "test_city",
    province: "test_province",
    hours_of_operation: null,
  },
};

const testCustomer: CustomerWithVehiclesType = {
  id: "",
  first_name: "customer_first_name",
  last_name: "customer_last_name",
  phone_number: "1234567890",
  email: "customer@test.com",
  password: "test_PASSWORD11",
  image: null,
  create_time: new Date(),
  update_time: new Date(),
  type: "CUSTOMER",
  vehicles: [
    {
      id: "test_customer_vehicle_id",
      create_time: new Date(),
      update_time: new Date(),
      customer_id: "test_customer_id",
      license_plate: "test_license_plate",
      make: "test_make",
      model: "test_model",
      vin: "test_vin",
      year: 2017,
    },
  ],
};

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

afterEach(async () => {
  await prisma.$transaction([
    prisma.vehicle.deleteMany(),
    prisma.employee.deleteMany(),
    prisma.customer.deleteMany(),
    prisma.shop.deleteMany(),
  ]);
});

describe("User Module", () => {
  it("FRT-M3-1: create customer request received with valid information", async () => {
    const { req, res } = createMockRequestResponse({ method: "POST" });
    req.body = {
      email: testCustomer.email,
      password: testCustomer.password,
      first_name: testCustomer.first_name,
      last_name: testCustomer.last_name,
      phone_number: testCustomer.phone_number,
      vehicle: {
        year: testCustomer.vehicles[0]?.year,
        make: testCustomer.vehicles[0]?.make,
        model: testCustomer.vehicles[0]?.model,
        vin: testCustomer.vehicles[0]?.vin,
        license_plate: testCustomer.vehicles[0]?.license_plate,
      },
    };

    await registerCustomerHandler(req, res);
    const newCustomer = await prisma.customer.findUnique({
      where: { email: testCustomer.email },
      include: { vehicles: true },
    });

    expect(res.statusCode).toBe(302);
    expect(newCustomer).toEqual({
      id: expect.any(String),
      first_name: testCustomer.first_name,
      last_name: testCustomer.last_name,
      phone_number: testCustomer.phone_number,
      email: testCustomer.email,
      password: expect.any(String),
      image: null,
      create_time: expect.any(Date),
      update_time: expect.any(Date),
      type: "CUSTOMER",
      vehicles: [
        {
          id: expect.any(String),
          create_time: expect.any(Date),
          update_time: expect.any(Date),
          year: testCustomer.vehicles[0]?.year,
          make: testCustomer.vehicles[0]?.make,
          model: testCustomer.vehicles[0]?.model,
          vin: testCustomer.vehicles[0]?.vin,
          license_plate: testCustomer.vehicles[0]?.license_plate,
          customer_id: expect.any(String),
        },
      ],
    });
  });

  it("FRT-M3-2: create customer request received with invalid information", async () => {
    const { req, res } = createMockRequestResponse({ method: "POST" });
    req.body = {
      email: testCustomer.email,
      password: testCustomer.password,
      first_name: testCustomer.first_name,
      last_name: testCustomer.last_name,
      phone_number: testCustomer.phone_number,
    };

    await registerCustomerHandler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("FRT-M3-3: create shop owner request received with valid information", async () => {
    const { req, res } = createMockRequestResponse({ method: "POST" });
    req.body = {
      email: testShopOwner.email,
      password: testShopOwner.password,
      first_name: testShopOwner.first_name,
      last_name: testShopOwner.last_name,
      phone_number: testShopOwner.phone_number,
      shop: testShopOwner.shop,
    };

    await registerShopOwnerHandler(req, res);
    const newShopOwner = await prisma.employee.findUnique({
      where: { email: testShopOwner.email },
    });

    expect(res.statusCode).toBe(302);
    expect(newShopOwner).toEqual({
      id: expect.any(String),
      create_time: expect.any(Date),
      update_time: expect.any(Date),
      first_name: testShopOwner.first_name,
      last_name: testShopOwner.last_name,
      phone_number: testShopOwner.phone_number,
      email: testShopOwner.email,
      password: expect.any(String),
      image: null,
      type: testShopOwner.type,
      shop_id: expect.any(String),
      status: testEmployee.status,
    });
  });

  it("FRT-M3-4: create shop owner request received with invalid information", async () => {
    const { req, res } = createMockRequestResponse({ method: "POST" });
    req.body = {
      email: testShopOwner.email,
      password: testShopOwner.password,
      first_name: testShopOwner.first_name,
      last_name: testShopOwner.last_name,
      phone_number: testShopOwner.phone_number,
    };

    await registerCustomerHandler(req, res);

    expect(res.statusCode).toBe(400);
  });

  it("FRT-M3-5: create employee request received with valid information", async () => {
    // Create Shop
    const shop = await createShop();
    testEmployee.shop_id = shop.id;

    const { req, res } = createMockRequestResponse({ method: "POST" });
    req.body = {
      email: testEmployee.email,
      password: testEmployee.password,
      first_name: testEmployee.first_name,
      last_name: testEmployee.last_name,
      phone_number: testEmployee.phone_number,
      shop_id: testEmployee.shop_id,
    };

    await registerEmployeeHandler(req, res);
    const newEmployee = await prisma.employee.findUnique({
      where: { email: testEmployee.email },
    });

    expect(res.statusCode).toBe(302);
    expect(newEmployee).toEqual({
      id: expect.any(String),
      create_time: expect.any(Date),
      update_time: expect.any(Date),
      first_name: testEmployee.first_name,
      last_name: testEmployee.last_name,
      phone_number: testEmployee.phone_number,
      email: testEmployee.email,
      password: expect.any(String),
      image: null,
      type: testEmployee.type,
      shop_id: testEmployee.shop_id,
      status: testEmployee.status,
    });
  });

  it("FRT-M3-6: create employee request received with invalid information", async () => {
    // Create Shop
    const shop = await createShop();
    testEmployee.shop_id = shop.id;

    const { req, res } = createMockRequestResponse({ method: "POST" });
    req.body = {
      email: testEmployee.email,
      password: testEmployee.password,
      first_name: testEmployee.first_name,
      last_name: testEmployee.last_name,
      shop_id: testEmployee.shop_id,
    };

    await registerEmployeeHandler(req, res);

    expect(res.statusCode).toBe(400);
  });
});

const createShop = async () => {
  return await prisma.shop.create({
    data: {
      phone_number: testShopOwner.shop.phone_number,
      email: testShopOwner.shop.email,
      name: testShopOwner.shop.name,
      address: testShopOwner.shop.address,
      postal_code: testShopOwner.shop.postal_code,
      city: testShopOwner.shop.city,
      province: testShopOwner.shop.province,
    },
  });
};
