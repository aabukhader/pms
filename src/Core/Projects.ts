import { Prisma } from '@prisma/client';
import { DbConnector } from './Base/DbConnector';
import { DefaultArgs } from '@prisma/client/runtime/library';

class Project extends DbConnector {
  public async create(
    project: Prisma.ProjectsCreateInput,
  ): Promise<Prisma.ProjectsCreateWithoutBoardsInput | Error> {
    try {
      const createdProject = await this.projects.create({ data: project });
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
      const updateProject = await this.projects.update({
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
      const project = await this.projects.findUnique({ where: { id } });
      return project;
    } catch (error) {
      return error;
    }
  }

  public async getAllByOwnerId(
    owner_id: string,
  ): Promise<Array<Partial<Prisma.ProjectsDelegate<DefaultArgs>>> | Error> {
    try {
      const projects = await this.projects.findMany({
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
      const boards = await this.projects.findMany({
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
    contributorsList: String,
    id: number,
  ): Promise<Prisma.ProjectsUpdateWithoutBoardsInput | Error> {
    try {
      const contributorsProjectList = await this.projects.findUnique({
        where: { id },
        select: {
          contributors: true,
        },
      });
      let list = contributorsList.split(',');
      let updatedList = [...contributorsProjectList.contributors];
      list.map((item) => {
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
    contributorsList: String,
    id: number,
  ): Promise<Prisma.ProjectsUpdateWithoutBoardsInput | Error> {
    try {
      const contributorsProjectList = await this.projects.findUnique({
        where: { id },
        select: {
          contributors: true,
        },
      });
      let list = contributorsList.split(',');
      let updatedList = [...contributorsProjectList.contributors];
      list.map((item) => {
        updatedList.splice(updatedList.indexOf(item), 1);
      });
      const updatedProject = await this.update(id, {
        contributors: updatedList,
      });
      return updatedProject;
    } catch (error) {
      return error;
    }
  }

  public async deleteProjectById(id: number): Promise<Boolean | Error> {
    try {
      await this.update(id, { is_deleted: true });
      return true;
    } catch (error) {
      return error;
    }
  }

  public async archivedProjectById(id: number): Promise<Boolean | Error> {
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
  ): Promise<Boolean | Error> {
    try {
      await this.update(id, { is_active: active });
      return true;
    } catch (error) {
      return error;
    }
  }
}

export default Project;
