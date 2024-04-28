import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createEvent = async (req: Request, res: Response) => {
  try {
    const event = await prisma.event.create({
      data: req.body,
    });
    return res.status(201).send({
      status: 201,
      success: true,
      messsage: "Event created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      success: false,
      message: JSON.stringify(error),
    });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    interface filterQuery {
      page?: number;
      id?: number;
      location?: string;
      event_name?: string;
    }

    const { id, location, event_name, page } = req.query;
    const filterData: filterQuery = {};

    if (id) {
      filterData.id = parseInt(id as string);
    }

    if (page) {
      filterData.page = parseInt(page as string);
    }

    if (location) {
      filterData.location = location as string;
    }

    if (event_name) {
      filterData.event_name = event_name as string;
    }

    const result = await prisma.event.findMany({
      skip: filterData.page ? (filterData.page * 4) - 4 : 0,
      take: 4,
      where: {
        id: filterData.id,
        location: filterData.location,
        event_name: {
          contains: filterData.event_name,
        },
      },
    });

    return res.status(200).send({
      page: page,
      status: 200,
      success: true,
      messsage: "get events successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      success: false,
      message: JSON.stringify(error),
    });
  }
};

export const getEventDetail = async (req: Request, res: Response) => {
  try {
    const result = await prisma.event.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    let status = 201;
    let message = "get event detail success";
    let success = true;

    if (!result) {
      status = 404;
      message = "event not found ";
      success = false;
    }

    return res.status(status).send({
      status: status,
      success: success,
      message: message,
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      success: false,
      message: JSON.stringify(error),
    });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    let result = await prisma.event.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    let status = 201;
    let message = "update event detail success";
    let success = true;

    if (!result) {
      status = 404;
      message = "event not found ";
      success = false;
    } else {
      result = await prisma.event.update({
        where: { id: parseInt(id) },
        data: req.body,
      });
    }

    return res.status(status).send({
      status: status,
      success: success,
      message: message,
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      success: false,
      message: JSON.stringify(error),
    });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await prisma.event.delete({
      where: { id: parseInt(id) },
    });

    return res.status(201).send({
      status: 201,
      success: true,
      message: "delete event success",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      success: false,
      message: JSON.stringify(error),
    });
  }
};

export const getEventStats = async (req: Request, res: Response) => {
  try {
    const eventStats = await prisma.event.aggregate({
      _count: {
        _all: true,
      },
      _min: {
        createdAt: true,
      },
      _max: {
        createdAt: true,
      },
    });
    console.log("Total events created : ", eventStats._count._all);
    console.log("Earlist cretaion time", eventStats._min.createdAt);
    console.log("Latest cretaion time", eventStats._max.createdAt);

    return res.status(201).send({
      status: 201,
      success: true,
      data: eventStats,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      success: false,
      message: JSON.stringify(error),
    });
  }
};
