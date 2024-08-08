import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DbConnector } from './Base/DbConnector.service';
import { DefaultArgs } from '@prisma/client/runtime/library';
@Injectable()
export class ProjectService {
  constructor(private readonly prisma: DbConnector) {}

  public async create(
    project: Prisma.ProjectsCreateInput,
  ): Promise<Prisma.ProjectsCreateWithoutBoardsInput | Error> {
    try {
      const createdProject = await this.prisma.projects.create({ data: project });
      return createdProject;
    } catch (error) {
      return error;
    }
  }

  public async update(
    id: number,
    project: Partial<Prisma.ProjectsUpdateInput>,
  ): Promise<Prisma.ProjectsUpdateWithoutBoardsInput | Error> {
    try {
      const updateProject = await this.prisma.projects.update({
        where: { id },
        data: project,
      });
      return updateProject;
    } catch (error) {
      return error;
    }
  }

  public async getById(
    id: number,
  ): Promise<Partial<Prisma.ProjectsDelegate<DefaultArgs>> | Error> {
    try {
      const project = await this.prisma.projects.findUnique({ where: { id } });
      return project;
    } catch (error) {
      return error;
    }
  }

  public async getAllByOwnerId(
    owner_id: string,
  ): Promise<Array<Partial<Prisma.ProjectsDelegate<DefaultArgs>>> | Error> {
    try {
      const projects = await this.prisma.projects.findMany({
        where: {
          owner_id,
        },
      });
      return projects;
    } catch (error) {
      return error;
    }
  }

  public async getBoards(
    id: number,
  ): Promise<Array<Partial<Prisma.ProjectsDelegate<DefaultArgs>>> | Error> {
    try {
      const boards = await this.prisma.projects.findMany({
        where: { id },
        include: {
          boards: true,
        },
      });
      return boards;
    } catch (error) {
      return error;
    }
  }

  public async addContributors(
    contributorsList: string,
    id: number,
  ): Promise<Prisma.ProjectsUpdateWithoutBoardsInput | Error> {
    try {
      const contributorsProjectList = await this.prisma.projects.findUnique({
        where: { id },
        select: {
          contributors: true,
        },
      });
      const list = contributorsList.split(',');
      const updatedList = [...contributorsProjectList.contributors];
      list.forEach(item => {
        updatedList.push(item);
      });
      const updatedProject = await this.update(id, {
        contributors: updatedList,
      });
      return updatedProject;
    } catch (error) {
      return error;
    }
  }

  public async removeContributors(
    contributorsList: string,
    id: number,
  ): Promise<Prisma.ProjectsUpdateWithoutBoardsInput | Error> {
    try {
      const contributorsProjectList = await this.prisma.projects.findUnique({
        where: { id },
        select: {
          contributors: true,
        },
      });
      const list = contributorsList.split(',');
      const updatedList = [...contributorsProjectList.contributors];
      list.forEach(item => {
        const index = updatedList.indexOf(item);
        if (index > -1) {
          updatedList.splice(index, 1);
        }
      });
      const updatedProject = await this.update(id, {
        contributors: updatedList,
      });
      return updatedProject;
    } catch (error) {
      return error;
    }
  }

  public async deleteProjectById(id: number): Promise<boolean | Error> {
    try {
      await this.update(id, { is_deleted: true });
      return true;
    } catch (error) {
      return error;
    }
  }

  public async archivedProjectById(id: number): Promise<boolean | Error> {
    try {
      await this.update(id, { is_archived: true });
      return true;
    } catch (error) {
      return error;
    }
  }

  public async changeProjectStateById(
    id: number,
    active: boolean,
  ): Promise<boolean | Error> {
    try {
      await this.update(id, { is_active: active });
      return true;
    } catch (error) {
      return error;
    }
  }
}
