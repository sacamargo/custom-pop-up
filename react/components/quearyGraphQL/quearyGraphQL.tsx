import { useQuery } from "react-apollo";

const { data, loading, error } = useQuery(GET_PRODUCT, {
  variables: {
    identifier: { field: 'refId', value: productId }
  }
})
