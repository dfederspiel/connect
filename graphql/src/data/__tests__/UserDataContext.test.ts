import { MockContext, Context, createMockContext } from '../../../__mocks__/context';
import UserDataContext from '../UserDataContext';

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});
describe('the user data context', () => {
  it('exists', () => {
    const context = new UserDataContext(ctx.prisma);
    expect(context).toBeDefined();
  });

  it('can get all users', async () => {
    mockCtx.prisma.user.findMany.mockResolvedValue([]);
    const context = new UserDataContext(ctx.prisma);
    const users = context.getAll();
    await expect(users).resolves.toEqual([]);
  });

  it('can get a single user', async () => {
    mockCtx.prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: '',
      domain: '',
    });
    const context = new UserDataContext(ctx.prisma);
    const users = context.getById(1);
    await expect(users).resolves.toEqual({
      id: 1,
      email: '',
      domain: '',
    });
  });

  it('can get a user by id', async () => {
    mockCtx.prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'user@contoso.com',
      domain: '',
    });
    const context = new UserDataContext(ctx.prisma);
    const users = context.getByEmail('user@contoso.com');
    await expect(users).resolves.toEqual({
      id: 1,
      email: 'user@contoso.com',
      domain: '',
    });
  });

  it('can create a user by email', async () => {
    mockCtx.prisma.user.create.mockResolvedValue({
      id: 1,
      email: 'abc@123.com',
      domain: '',
    });
    const context = new UserDataContext(ctx.prisma);
    const users = context.createUser('abc@123.com');
    await expect(users).resolves.toEqual({
      id: 1,
      email: 'abc@123.com',
      domain: '',
    });
  });

  it('can create a user by user object', async () => {
    mockCtx.prisma.user.create.mockResolvedValue({
      id: 1,
      email: 'abc@123.com',
      domain: '',
    });
    const context = new UserDataContext(ctx.prisma);
    const users = context.post({
      id: 1,
      email: 'abc@123.com',
      domain: '',
    });
    await expect(users).resolves.toEqual({
      id: 1,
      email: 'abc@123.com',
      domain: '',
    });
  });
});
