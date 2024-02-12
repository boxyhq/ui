import { useContext } from '@builder.io/mitosis';
import PaginateContext from '../../../shared/Paginate/paginate.context.lite';

export default function Test() {
  const context = useContext(PaginateContext);
  return <span>{context.offset}</span>;
}
